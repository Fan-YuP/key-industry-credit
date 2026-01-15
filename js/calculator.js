// 授信测算模块
class CreditCalculator {
    constructor() {
        this.industryConfigs = {
            mechanical: {
                name: '机械加工行业',
                maxCreditLimit: 200, // 单户最高授信额度上限（万元）
                flowRatio: 0.2 // 近一年销售收入占比
            },
            tobacco: {
                name: '烟草行业',
                maxCreditLimit: 200, // 信用类贷款额度上限（万元）
                recentOrderRatio: 0.5, // 近12个月订烟量进货额占比
                maxMonthlyOrderRatio: 1.5, // 往年订烟量最高月份进货额占比
                retailIncomeRatio: 0.15 // 近12个月零售类经营收入占比
            },
            retail: {
                name: '零售百货行业',
                maxCreditLimit: 80, // 信用、保证类最高授信额度上限（万元）
                flowRatio: 0.3 // 近一年销售收入占比
            },
            'fruit-storage': {
                name: '果蔬仓储行业',
                maxCreditLimit: 0, // 无特定上限
                flowRatio: 0.3 // 近一年销售收入占比
            },
            'apple-planting': {
                name: '苹果种植行业',
                maxCreditLimit: 0, // 无特定上限
                costPerAcre: 0.56 // 亩均种植成本（万元/亩，5600元/亩）
            },
            'grain-purchase': {
                name: '粮食购销行业',
                maxCreditLimit: 200, // 信用类、保证类最高授信额度上限（万元）
                flowRatio: 0.1 // 近一年销售收入占比
            },
            'grain-processing': {
                name: '粮食加工行业',
                maxCreditLimit: 200, // 信用类、保证类最高授信额度上限（万元）
                flowRatio: 0.15 // 近一年销售收入占比
            },
            'grain-planting': {
                name: '粮食种植行业',
                maxCreditLimit: 200, // 信用类、保证类最高授信额度上限（万元）
                costPerAcre: 0.15 // 亩均种植成本（万元/亩，1500元/亩）
            },
            catering: {
                name: '餐饮行业',
                maxCreditLimit: 200, // 信用类、保证类最高授信额度上限（万元）
                mortgageRatio: 0.6, // 抵押类近一年销售收入占比
                guaranteeRatio: 0.45, // 保证类近一年销售收入占比
                creditRatio: 0.2 // 信用类近一年销售收入占比
            }
            // 其他行业配置将在后续扩展
        };
    }

    // 获取行业配置
    getIndustryConfig(industry) {
        return this.industryConfigs[industry] || this.industryConfigs.mechanical;
    }

    // 机械加工行业测算
    calculateMechanical(data) {
        // 单户最高授信额度 = 近一年销售收入 × 20%，最高200万元
        const maxCredit = Math.min(data.salesCurrent * this.industryConfigs.mechanical.flowRatio, this.industryConfigs.mechanical.maxCreditLimit);
        
        // 我行拟授信额度 = 单户最高授信额度 - 家庭负债，最低0万元
        const creditAmount = Math.max(maxCredit - data.familyLiabilities, 0);
        
        return {
            maxCredit: maxCredit,
            creditAmount: creditAmount
        };
    }

    // 烟草行业测算
    calculateTobacco(data) {
        const config = this.industryConfigs.tobacco;
        
        // 额度一：近12个月订烟量进货额的50%
        const quota1_1 = data.recentOrderAmount * config.recentOrderRatio;
        // 额度一：往年订烟量最高月份进货额的1.5倍
        const quota1_2 = data.maxMonthlyOrder * config.maxMonthlyOrderRatio;
        // 额度一：取两者较高值
        const quota1 = Math.max(quota1_1, quota1_2);
        
        // 额度二：近12个月零售类经营收入的15%
        const quota2 = data.retailIncome * config.retailIncomeRatio;
        
        // 拟授信额度：额度一 + 额度二
        const totalCredit = quota1 + quota2;
        
        // 信用类贷款额度不能超过200万
        const creditAmount = Math.min(totalCredit, config.maxCreditLimit);
        
        // 超过200万的部分需要追加担保
        const guaranteeAmount = Math.max(totalCredit - config.maxCreditLimit, 0);
        
        return {
            quota1: quota1,
            quota2: quota2,
            totalCredit: totalCredit,
            creditAmount: creditAmount,
            guaranteeAmount: guaranteeAmount
        };
    }

    // 零售百货行业测算
    calculateRetail(data) {
        const config = this.industryConfigs.retail;
        
        // 单户最高授信额度 = 近一年销售收入 × 30%
        let maxCredit = data.salesCurrent * config.flowRatio;
        
        // 单户最高授信额度不超过80万元
        maxCredit = Math.min(maxCredit, config.maxCreditLimit);
        
        // 我行拟授信额度 = 单户最高授信额度 - 家庭负债，最低0万元
        const creditAmount = Math.max(maxCredit - data.familyLiabilities, 0);
        
        return {
            maxCredit: maxCredit,
            creditAmount: creditAmount
        };
    }
    
    // 果蔬仓储行业测算
    calculateFruitStorage(data) {
        const config = this.industryConfigs['fruit-storage'];
        
        // 单户最高授信额度 = 近一年销售收入 × 30%
        let maxCredit = data.salesCurrent * config.flowRatio;
        
        // 我行拟授信额度 = 单户最高授信额度 - 家庭负债，最低0万元
        const creditAmount = Math.max(maxCredit - data.familyLiabilities, 0);
        
        return {
            maxCredit: maxCredit,
            creditAmount: creditAmount
        };
    }
    
    // 苹果种植行业测算
    calculateApplePlanting(data) {
        const config = this.industryConfigs['apple-planting'];
        
        // 单户最高授信额度 = 果树种植亩数 × 亩均种植成本（5600元/亩 = 0.56万元/亩）
        const maxCredit = data.acreage * config.costPerAcre;
        
        // 我行拟授信额度 = 单户最高授信额度 - 家庭负债，最低0万元
        const creditAmount = Math.max(maxCredit - data.familyLiabilities, 0);
        
        return {
            maxCredit: maxCredit,
            creditAmount: creditAmount
        };
    }
    
    // 粮食购销行业测算
    calculateGrainPurchase(data) {
        const config = this.industryConfigs['grain-purchase'];
        
        // 单户最高授信额度 = 近一年销售收入 × 10%，信用类、保证类最高200万元
        let maxCredit = data.salesCurrent * config.flowRatio;
        maxCredit = Math.min(maxCredit, config.maxCreditLimit);
        
        // 我行拟授信额度 = 单户最高授信额度 - 家庭负债，最低0万元
        const creditAmount = Math.max(maxCredit - data.familyLiabilities, 0);
        
        return {
            maxCredit: maxCredit,
            creditAmount: creditAmount
        };
    }
    
    // 粮食加工行业测算
    calculateGrainProcessing(data) {
        const config = this.industryConfigs['grain-processing'];
        
        // 单户最高授信额度 = 近一年销售收入 × 15%，信用类、保证类最高200万元
        let maxCredit = data.salesCurrent * config.flowRatio;
        maxCredit = Math.min(maxCredit, config.maxCreditLimit);
        
        // 我行拟授信额度 = 单户最高授信额度 - 家庭负债，最低0万元
        const creditAmount = Math.max(maxCredit - data.familyLiabilities, 0);
        
        return {
            maxCredit: maxCredit,
            creditAmount: creditAmount
        };
    }
    
    // 粮食种植行业测算
    calculateGrainPlanting(data) {
        const config = this.industryConfigs['grain-planting'];
        
        // 单户最高授信额度 = 粮食种植亩数 × 亩均种植成本（1500元/亩 = 0.15万元/亩）
        let maxCredit = data.acreage * config.costPerAcre;
        // 信用类、保证类最高授信额度上限为200万元
        maxCredit = Math.min(maxCredit, config.maxCreditLimit);
        
        // 我行拟授信额度 = 单户最高授信额度 - 家庭负债，最低0万元
        const creditAmount = Math.max(maxCredit - data.familyLiabilities, 0);
        
        return {
            maxCredit: maxCredit,
            creditAmount: creditAmount
        };
    }
    
    // 餐饮行业测算
    calculateCatering(data) {
        const config = this.industryConfigs.catering;
        let flowRatio = 0;
        
        // 根据贷款类型选择不同的近一年销售收入占比
        switch (data.loanType) {
            case 'mortgage':
                flowRatio = config.mortgageRatio; // 抵押类：60%
                break;
            case 'guarantee':
                flowRatio = config.guaranteeRatio; // 保证类：45%
                break;
            case 'credit':
                flowRatio = config.creditRatio; // 信用类：20%
                break;
        }
        
        // 单户最高授信额度 = 近一年销售收入 × 对应比例
        let maxCredit = data.salesCurrent * flowRatio;
        
        // 近一年销售收入较上一年销售收入下降的，单户最高授信额度 × 90%
        if (data.salesCurrent < data.salesPrevious) {
            maxCredit *= 0.9;
        }
        
        // 信用类、保证类最高授信额度上限为200万元
        if (data.loanType !== 'mortgage') {
            maxCredit = Math.min(maxCredit, config.maxCreditLimit);
        }
        
        // 我行拟授信额度 = 单户最高授信额度 - 家庭负债，最低0万元
        const creditAmount = Math.max(maxCredit - data.familyLiabilities, 0);
        
        return {
            maxCredit: maxCredit,
            creditAmount: creditAmount
        };
    }

    // 主测算函数
    calculate(industry, data) {
        let result = {
            maxCredit: 0,
            creditAmount: 0,
            quota1: 0,
            quota2: 0,
            totalCredit: 0,
            guaranteeAmount: 0
        };
        
        switch (industry) {
            case 'mechanical':
                result = this.calculateMechanical(data);
                break;
            case 'tobacco':
                result = this.calculateTobacco(data);
                break;
            case 'retail':
                result = this.calculateRetail(data);
                break;
            case 'fruit-storage':
                result = this.calculateFruitStorage(data);
                break;
            case 'apple-planting':
                result = this.calculateApplePlanting(data);
                break;
            case 'grain-purchase':
                result = this.calculateGrainPurchase(data);
                break;
            case 'grain-processing':
                result = this.calculateGrainProcessing(data);
                break;
            case 'grain-planting':
                result = this.calculateGrainPlanting(data);
                break;
            case 'catering':
                result = this.calculateCatering(data);
                break;
            // 其他行业的测算逻辑将在后续扩展
            default:
                result = this.calculateMechanical(data);
        }
        
        return result;
    }

    // 格式化金额（保留两位小数）
    formatAmount(amount) {
        return parseFloat(amount).toFixed(2);
    }

    // 显示测算结果
    showResult(industry, data, result) {
        // 更新结果金额
        const amountElement = document.getElementById('credit-amount');
        if (amountElement) {
            amountElement.textContent = this.formatAmount(result.creditAmount);
        }
        
        // 更新测算详情
        this.updateResultDetails(industry, data, result);
        
        // 切换到结果页面
        this.switchStep(3);
    }

    // 更新测算详情
    updateResultDetails(industry, data, result) {
        const detailsContainer = document.querySelector('.result-details');
        
        if (industry === 'tobacco') {
            // 烟草行业测算详情
            detailsContainer.innerHTML = `
                <h3 class="details-title">测算详情</h3>
                <div class="detail-item">
                    <span class="detail-label">近12个月订烟进货额：</span>
                    <span class="detail-value">${this.formatAmount(data.recentOrderAmount)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">往年订烟量最高月份进货额：</span>
                    <span class="detail-value">${this.formatAmount(data.maxMonthlyOrder)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">近12个月零售类经营收入：</span>
                    <span class="detail-value">${this.formatAmount(data.retailIncome)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">额度一（订烟相关）：</span>
                    <span class="detail-value">${this.formatAmount(result.quota1)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">额度二（零售收入）：</span>
                    <span class="detail-value">${this.formatAmount(result.quota2)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">总授信额度：</span>
                    <span class="detail-value">${this.formatAmount(result.totalCredit)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">信用类贷款额度：</span>
                    <span class="detail-value">${this.formatAmount(result.creditAmount)}万元</span>
                </div>
                ${result.guaranteeAmount > 0 ? `
                <div class="detail-item">
                    <span class="detail-label">需追加担保额度：</span>
                    <span class="detail-value" style="color: #e74c3c;">${this.formatAmount(result.guaranteeAmount)}万元</span>
                </div>
                ` : ''}
            `;
        } else if (industry === 'retail') {
            // 零售百货行业测算详情
            detailsContainer.innerHTML = `
                <h3 class="details-title">测算详情</h3>
                <div class="detail-item">
                    <span class="detail-label">近一年销售收入：</span>
                    <span class="detail-value">${this.formatAmount(data.salesCurrent)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">单户最高授信额度：</span>
                    <span class="detail-value">${this.formatAmount(result.maxCredit)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">家庭负债：</span>
                    <span class="detail-value">${this.formatAmount(data.familyLiabilities)}万元</span>
                </div>
            `;
        } else if (industry === 'fruit-storage') {
            // 果蔬仓储行业测算详情
            detailsContainer.innerHTML = `
                <h3 class="details-title">测算详情</h3>
                <div class="detail-item">
                    <span class="detail-label">近一年销售收入：</span>
                    <span class="detail-value">${this.formatAmount(data.salesCurrent)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">单户最高授信额度：</span>
                    <span class="detail-value">${this.formatAmount(result.maxCredit)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">家庭负债：</span>
                    <span class="detail-value">${this.formatAmount(data.familyLiabilities)}万元</span>
                </div>
            `;
        } else if (industry === 'apple-planting') {
            // 苹果种植行业测算详情
            detailsContainer.innerHTML = `
                <h3 class="details-title">测算详情</h3>
                <div class="detail-item">
                    <span class="detail-label">果树种植亩数：</span>
                    <span class="detail-value">${this.formatAmount(data.acreage)}亩</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">亩均种植成本：</span>
                    <span class="detail-value">${this.formatAmount(this.industryConfigs['apple-planting'].costPerAcre * 10000)}元/亩</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">单户最高授信额度：</span>
                    <span class="detail-value">${this.formatAmount(result.maxCredit)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">家庭负债：</span>
                    <span class="detail-value">${this.formatAmount(data.familyLiabilities)}万元</span>
                </div>
            `;
        } else if (industry === 'grain-purchase') {
            // 粮食购销行业测算详情
            detailsContainer.innerHTML = `
                <h3 class="details-title">测算详情</h3>
                <div class="detail-item">
                    <span class="detail-label">近一年销售收入：</span>
                    <span class="detail-value">${this.formatAmount(data.salesCurrent)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">单户最高授信额度：</span>
                    <span class="detail-value">${this.formatAmount(result.maxCredit)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">家庭负债：</span>
                    <span class="detail-value">${this.formatAmount(data.familyLiabilities)}万元</span>
                </div>
            `;
        } else if (industry === 'grain-processing') {
            // 粮食加工行业测算详情
            detailsContainer.innerHTML = `
                <h3 class="details-title">测算详情</h3>
                <div class="detail-item">
                    <span class="detail-label">近一年销售收入：</span>
                    <span class="detail-value">${this.formatAmount(data.salesCurrent)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">单户最高授信额度：</span>
                    <span class="detail-value">${this.formatAmount(result.maxCredit)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">家庭负债：</span>
                    <span class="detail-value">${this.formatAmount(data.familyLiabilities)}万元</span>
                </div>
            `;
        } else if (industry === 'grain-planting') {
            // 粮食种植行业测算详情
            detailsContainer.innerHTML = `
                <h3 class="details-title">测算详情</h3>
                <div class="detail-item">
                    <span class="detail-label">粮食种植亩数：</span>
                    <span class="detail-value">${this.formatAmount(data.acreage)}亩</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">亩均种植成本：</span>
                    <span class="detail-value">${this.formatAmount(this.industryConfigs['grain-planting'].costPerAcre * 10000)}元/亩</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">单户最高授信额度：</span>
                    <span class="detail-value">${this.formatAmount(result.maxCredit)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">家庭负债：</span>
                    <span class="detail-value">${this.formatAmount(data.familyLiabilities)}万元</span>
                </div>
            `;
        } else if (industry === 'catering') {
            // 餐饮行业测算详情
            const config = this.industryConfigs.catering;
            let loanTypeText = '';
            let ratioText = '';
            
            switch (data.loanType) {
                case 'mortgage':
                    loanTypeText = '抵押类';
                    ratioText = '60%';
                    break;
                case 'guarantee':
                    loanTypeText = '保证类（不含家庭成员担保）';
                    ratioText = '45%';
                    break;
                case 'credit':
                    loanTypeText = '信用类';
                    ratioText = '20%';
                    break;
            }
            
            const salesDecreased = data.salesCurrent < data.salesPrevious;
            
            detailsContainer.innerHTML = `
                <h3 class="details-title">测算详情</h3>
                <div class="detail-item">
                    <span class="detail-label">近一年销售收入：</span>
                    <span class="detail-value">${this.formatAmount(data.salesCurrent)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">贷款类型：</span>
                    <span class="detail-value">${loanTypeText}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">近一年销售收入：</span>
                    <span class="detail-value">${this.formatAmount(data.salesCurrent)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">上一年销售收入：</span>
                    <span class="detail-value">${this.formatAmount(data.salesPrevious)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">单户最高授信额度：</span>
                    <span class="detail-value">${this.formatAmount(result.maxCredit)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">家庭负债：</span>
                    <span class="detail-value">${this.formatAmount(data.familyLiabilities)}万元</span>
                </div>
            `;
        } else {
            // 默认机械加工行业测算详情
            detailsContainer.innerHTML = `
                <h3 class="details-title">测算详情</h3>
                <div class="detail-item">
                    <span class="detail-label">近一年销售收入：</span>
                    <span class="detail-value">${this.formatAmount(data.salesCurrent)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">单户最高授信额度：</span>
                    <span class="detail-value">${this.formatAmount(result.maxCredit)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">家庭负债：</span>
                    <span class="detail-value">${this.formatAmount(data.familyLiabilities)}万元</span>
                </div>
            `;
        }
    }

    // 切换步骤
    switchStep(step) {
        // 更新步骤指示器
        const steps = document.querySelectorAll('.step');
        steps.forEach((s, index) => {
            if (index + 1 === step) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
        
        // 更新步骤内容
        const contents = document.querySelectorAll('.step-content');
        contents.forEach((content, index) => {
            if (index + 1 === step) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }

    // 获取当前选择的行业
    getCurrentIndustry() {
        const industryInputs = document.querySelectorAll('input[name="industry"]');
        for (let input of industryInputs) {
            if (input.checked) {
                return input.value;
            }
        }
        return 'mechanical'; // 默认机械加工行业
    }

    // 获取机械加工行业表单数据
    getMechanicalFormData() {
        return {
            salesCurrent: parseFloat(document.getElementById('sales-current').value) || 0,
            salesPrevious: parseFloat(document.getElementById('sales-previous').value) || 0,
            familyAssets: parseFloat(document.getElementById('family-assets').value) || 0,
            totalLiabilities: parseFloat(document.getElementById('total-liabilities').value) || 0,
            familyLiabilities: parseFloat(document.getElementById('family-liabilities').value) || 0,
            operationYears: parseFloat(document.getElementById('operation-years').value) || 0
        };
    }

    // 获取烟草行业表单数据
    getTobaccoFormData() {
        return {
            salesCurrent: parseFloat(document.getElementById('tobacco-sales-current').value) || 0,
            salesPrevious: parseFloat(document.getElementById('tobacco-sales-previous').value) || 0,
            familyAssets: parseFloat(document.getElementById('tobacco-family-assets').value) || 0,
            totalLiabilities: parseFloat(document.getElementById('tobacco-total-liabilities').value) || 0,
            familyLiabilities: parseFloat(document.getElementById('tobacco-family-liabilities').value) || 0,
            operationYears: parseFloat(document.getElementById('tobacco-operation-years').value) || 0,
            recentOrderAmount: parseFloat(document.getElementById('tobacco-recent-order-amount').value) || 0,
            maxMonthlyOrder: parseFloat(document.getElementById('tobacco-max-monthly-order').value) || 0,
            retailIncome: parseFloat(document.getElementById('tobacco-retail-income').value) || 0
        };
    }

    // 获取零售百货行业表单数据
    getRetailFormData() {
        return {
            salesCurrent: parseFloat(document.getElementById('retail-sales-current').value) || 0,
            salesPrevious: parseFloat(document.getElementById('retail-sales-previous').value) || 0,
            familyAssets: parseFloat(document.getElementById('retail-family-assets').value) || 0,
            totalLiabilities: parseFloat(document.getElementById('retail-total-liabilities').value) || 0,
            familyLiabilities: parseFloat(document.getElementById('retail-family-liabilities').value) || 0,
            operationYears: parseFloat(document.getElementById('retail-operation-years').value) || 0
        };
    }
    
    // 获取果蔬仓储行业表单数据
    getFruitStorageFormData() {
        return {
            salesCurrent: parseFloat(document.getElementById('fruit-storage-sales-current').value) || 0,
            salesPrevious: parseFloat(document.getElementById('fruit-storage-sales-previous').value) || 0,
            familyAssets: parseFloat(document.getElementById('fruit-storage-family-assets').value) || 0,
            totalLiabilities: parseFloat(document.getElementById('fruit-storage-total-liabilities').value) || 0,
            familyLiabilities: parseFloat(document.getElementById('fruit-storage-family-liabilities').value) || 0,
            operationYears: parseFloat(document.getElementById('fruit-storage-operation-years').value) || 0
        };
    }
    
    // 获取苹果种植行业表单数据
    getApplePlantingFormData() {
        return {
            salesCurrent: parseFloat(document.getElementById('apple-planting-sales-current').value) || 0,
            salesPrevious: parseFloat(document.getElementById('apple-planting-sales-previous').value) || 0,
            familyAssets: parseFloat(document.getElementById('apple-planting-family-assets').value) || 0,
            totalLiabilities: parseFloat(document.getElementById('apple-planting-total-liabilities').value) || 0,
            familyLiabilities: parseFloat(document.getElementById('apple-planting-family-liabilities').value) || 0,
            operationYears: parseFloat(document.getElementById('apple-planting-operation-years').value) || 0,
            acreage: parseFloat(document.getElementById('apple-planting-acreage').value) || 0
        };
    }
    
    // 获取粮食购销行业表单数据
    getGrainPurchaseFormData() {
        return {
            salesCurrent: parseFloat(document.getElementById('grain-purchase-sales-current').value) || 0,
            salesPrevious: parseFloat(document.getElementById('grain-purchase-sales-previous').value) || 0,
            familyAssets: parseFloat(document.getElementById('grain-purchase-family-assets').value) || 0,
            totalLiabilities: parseFloat(document.getElementById('grain-purchase-total-liabilities').value) || 0,
            familyLiabilities: parseFloat(document.getElementById('grain-purchase-family-liabilities').value) || 0,
            operationYears: parseFloat(document.getElementById('grain-purchase-operation-years').value) || 0
        };
    }
    
    // 获取粮食加工行业表单数据
    getGrainProcessingFormData() {
        return {
            salesCurrent: parseFloat(document.getElementById('grain-processing-sales-current').value) || 0,
            salesPrevious: parseFloat(document.getElementById('grain-processing-sales-previous').value) || 0,
            familyAssets: parseFloat(document.getElementById('grain-processing-family-assets').value) || 0,
            totalLiabilities: parseFloat(document.getElementById('grain-processing-total-liabilities').value) || 0,
            familyLiabilities: parseFloat(document.getElementById('grain-processing-family-liabilities').value) || 0,
            operationYears: parseFloat(document.getElementById('grain-processing-operation-years').value) || 0
        };
    }
    
    // 获取粮食种植行业表单数据
    getGrainPlantingFormData() {
        return {
            salesCurrent: parseFloat(document.getElementById('grain-planting-sales-current').value) || 0,
            salesPrevious: parseFloat(document.getElementById('grain-planting-sales-previous').value) || 0,
            familyAssets: parseFloat(document.getElementById('grain-planting-family-assets').value) || 0,
            totalLiabilities: parseFloat(document.getElementById('grain-planting-total-liabilities').value) || 0,
            familyLiabilities: parseFloat(document.getElementById('grain-planting-family-liabilities').value) || 0,
            operationYears: parseFloat(document.getElementById('grain-planting-operation-years').value) || 0,
            acreage: parseFloat(document.getElementById('grain-planting-acreage').value) || 0
        };
    }
    
    // 获取餐饮行业表单数据
    getCateringFormData() {
        const loanTypeElement = document.querySelector('input[name="catering-loan-type"]:checked');
        return {
            salesCurrent: parseFloat(document.getElementById('catering-sales-current').value) || 0,
            salesPrevious: parseFloat(document.getElementById('catering-sales-previous').value) || 0,
            totalInvestment: parseFloat(document.getElementById('catering-total-investment').value) || 0,
            familyAssets: parseFloat(document.getElementById('catering-family-assets').value) || 0,
            totalLiabilities: parseFloat(document.getElementById('catering-total-liabilities').value) || 0,
            familyLiabilities: parseFloat(document.getElementById('catering-family-liabilities').value) || 0,
            operationYears: parseFloat(document.getElementById('catering-operation-years').value) || 0,
            loanType: loanTypeElement ? loanTypeElement.value : 'mortgage'
        };
    }

    // 获取当前表单数据
    getCurrentFormData(industry) {
        switch (industry) {
            case 'mechanical':
                return this.getMechanicalFormData();
            case 'tobacco':
                return this.getTobaccoFormData();
            case 'retail':
                return this.getRetailFormData();
            case 'fruit-storage':
                return this.getFruitStorageFormData();
            case 'apple-planting':
                return this.getApplePlantingFormData();
            case 'grain-purchase':
                return this.getGrainPurchaseFormData();
            case 'grain-processing':
                return this.getGrainProcessingFormData();
            case 'grain-planting':
                return this.getGrainPlantingFormData();
            case 'catering':
                return this.getCateringFormData();
            // 其他行业的表单数据获取将在后续扩展
            default:
                return this.getMechanicalFormData();
        }
    }
}

// 实例化测算器
const calculator = new CreditCalculator();