// 授信测算模块
class CreditCalculator {
    constructor() {
        this.industryConfigs = {
            mechanical: {
                name: '机械加工行业',
                maxCreditLimit: 200, // 单户最高授信额度上限（万元）
                flowRatio: 0.2 // 年经营流水占比
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
                flowRatio: 0.3 // 年经营流水占比
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
        // 单户最高授信额度 = 年经营流水 × 20%，最高200万元
        const maxCredit = Math.min(data.annualFlow * this.industryConfigs.mechanical.flowRatio, this.industryConfigs.mechanical.maxCreditLimit);
        
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
        
        // 单户最高授信额度 = 年经营流水 × 30%
        let maxCredit = data.annualFlow * config.flowRatio;
        
        // 单户最高授信额度不超过80万元
        maxCredit = Math.min(maxCredit, config.maxCreditLimit);
        
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
                <div class="detail-item">
                    <span class="detail-label">测算公式：</span>
                    <span class="detail-value formula">拟授信额度 = 额度一 + 额度二</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">额度一公式：</span>
                    <span class="detail-value formula">max(近12个月订烟进货额×50%, 往年订烟最高月进货额×1.5)</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">额度二公式：</span>
                    <span class="detail-value formula">近12个月零售类经营收入×15%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">信用类贷款上限：</span>
                    <span class="detail-value formula">200万元（超过部分需追加担保）</span>
                </div>
            `;
        } else if (industry === 'retail') {
            // 零售百货行业测算详情
            detailsContainer.innerHTML = `
                <h3 class="details-title">测算详情</h3>
                <div class="detail-item">
                    <span class="detail-label">年经营流水：</span>
                    <span class="detail-value">${this.formatAmount(data.annualFlow)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">单户最高授信额度：</span>
                    <span class="detail-value">${this.formatAmount(result.maxCredit)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">家庭负债：</span>
                    <span class="detail-value">${this.formatAmount(data.familyLiabilities)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">测算公式：</span>
                    <span class="detail-value formula">拟授信额度 = 单户最高授信额度 - 家庭负债</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">单户最高授信额度公式：</span>
                    <span class="detail-value formula">年经营流水 × 30%（最高80万元）</span>
                </div>
            `;
        } else {
            // 默认机械加工行业测算详情
            detailsContainer.innerHTML = `
                <h3 class="details-title">测算详情</h3>
                <div class="detail-item">
                    <span class="detail-label">年经营流水：</span>
                    <span class="detail-value">${this.formatAmount(data.annualFlow)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">单户最高授信额度：</span>
                    <span class="detail-value">${this.formatAmount(result.maxCredit)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">家庭负债：</span>
                    <span class="detail-value">${this.formatAmount(data.familyLiabilities)}万元</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">测算公式：</span>
                    <span class="detail-value formula">拟授信额度 = 单户最高授信额度 - 家庭负债</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">单户最高授信额度公式：</span>
                    <span class="detail-value formula">年经营流水 × 20%（最高200万元）</span>
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
            annualFlow: parseFloat(document.getElementById('annual-flow').value) || 0,
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
            annualFlow: parseFloat(document.getElementById('tobacco-annual-flow').value) || 0,
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
            annualFlow: parseFloat(document.getElementById('retail-annual-flow').value) || 0,
            salesCurrent: parseFloat(document.getElementById('retail-sales-current').value) || 0,
            salesPrevious: parseFloat(document.getElementById('retail-sales-previous').value) || 0,
            familyAssets: parseFloat(document.getElementById('retail-family-assets').value) || 0,
            totalLiabilities: parseFloat(document.getElementById('retail-total-liabilities').value) || 0,
            familyLiabilities: parseFloat(document.getElementById('retail-family-liabilities').value) || 0,
            operationYears: parseFloat(document.getElementById('retail-operation-years').value) || 0
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
            // 其他行业的表单数据获取将在后续扩展
            default:
                return this.getMechanicalFormData();
        }
    }
}

// 实例化测算器
const calculator = new CreditCalculator();