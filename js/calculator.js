// 授信测算模块
class CreditCalculator {
    constructor() {
        this.industryConfigs = {
            mechanical: {
                name: '机械加工行业',
                maxCreditLimit: 200, // 单户最高授信额度上限（万元）
                flowRatio: 0.2 // 年经营流水占比
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

    // 主测算函数
    calculate(industry, data) {
        let result = {
            maxCredit: 0,
            creditAmount: 0
        };
        
        switch (industry) {
            case 'mechanical':
                result = this.calculateMechanical(data);
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
        document.getElementById('detail-flow').textContent = this.formatAmount(data.annualFlow) + '万元';
        document.getElementById('detail-max-credit').textContent = this.formatAmount(result.maxCredit) + '万元';
        document.getElementById('detail-family-liabilities').textContent = this.formatAmount(data.familyLiabilities) + '万元';
        
        // 切换到结果页面
        this.switchStep(3);
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

    // 获取当前表单数据
    getCurrentFormData(industry) {
        switch (industry) {
            case 'mechanical':
                return this.getMechanicalFormData();
            // 其他行业的表单数据获取将在后续扩展
            default:
                return this.getMechanicalFormData();
        }
    }
}

// 实例化测算器
const calculator = new CreditCalculator();