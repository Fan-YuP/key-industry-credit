// 表单验证模块
class FormValidator {
    constructor() {
        this.errors = {};
    }

    // 验证数字是否为正数
    validatePositiveNumber(value, fieldName) {
        if (value === '' || value === null || value === undefined) {
            return `${fieldName}不能为空`;
        }
        
        const num = parseFloat(value);
        if (isNaN(num)) {
            return `${fieldName}必须是数字`;
        }
        
        if (num < 0) {
            return `${fieldName}必须大于等于0`;
        }
        
        return '';
    }

    // 验证必填项
    validateRequired(value, fieldName) {
        if (value === '' || value === null || value === undefined) {
            return `${fieldName}不能为空`;
        }
        return '';
    }

    // 验证经营年限（精确到0.5年）
    validateOperationYears(value, fieldName) {
        const baseError = this.validatePositiveNumber(value, fieldName);
        if (baseError) {
            return baseError;
        }
        
        const num = parseFloat(value);
        if (num % 0.5 !== 0) {
            return `${fieldName}必须精确到0.5年`;
        }
        
        return '';
    }

    // 显示错误信息
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? 'block' : 'none';
        }
    }

    // 隐藏所有错误信息
    hideAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    // 验证机械加工行业表单
    validateMechanicalForm() {
        this.hideAllErrors();
        let isValid = true;
        
        // 获取表单值
        const annualFlow = document.getElementById('annual-flow').value;
        const salesCurrent = document.getElementById('sales-current').value;
        const salesPrevious = document.getElementById('sales-previous').value;
        const familyAssets = document.getElementById('family-assets').value;
        const totalLiabilities = document.getElementById('total-liabilities').value;
        const familyLiabilities = document.getElementById('family-liabilities').value;
        const operationYears = document.getElementById('operation-years').value;
        const legalStatus = document.querySelector('input[name="legal-status"]:checked');
        
        // 验证年经营流水
        const flowError = this.validatePositiveNumber(annualFlow, '年经营流水');
        if (flowError) {
            this.showError('error-annual-flow', flowError);
            isValid = false;
        }
        
        // 验证近一年销售收入
        const currentError = this.validatePositiveNumber(salesCurrent, '近一年销售收入');
        if (currentError) {
            this.showError('error-sales-current', currentError);
            isValid = false;
        }
        
        // 验证上一年销售收入
        const previousError = this.validatePositiveNumber(salesPrevious, '上一年销售收入');
        if (previousError) {
            this.showError('error-sales-previous', previousError);
            isValid = false;
        }
        
        // 验证家庭资产
        const assetsError = this.validatePositiveNumber(familyAssets, '家庭资产');
        if (assetsError) {
            this.showError('error-family-assets', assetsError);
            isValid = false;
        }
        
        // 验证总负债
        const totalError = this.validatePositiveNumber(totalLiabilities, '总负债');
        if (totalError) {
            this.showError('error-total-liabilities', totalError);
            isValid = false;
        }
        
        // 验证家庭负债
        const familyError = this.validatePositiveNumber(familyLiabilities, '家庭负债');
        if (familyError) {
            this.showError('error-family-liabilities', familyError);
            isValid = false;
        }
        
        // 验证经营年限（精确到0.5年，且必须大于等于1年）
        const yearsError = this.validateOperationYears(operationYears, '经营年限');
        if (yearsError) {
            this.showError('error-operation-years', yearsError);
            isValid = false;
        } else {
            const years = parseFloat(operationYears);
            if (years < 1) {
                this.showError('error-operation-years', '不符合准入要求：企业实际经营时间未满一年');
                isValid = false;
            }
        }
        
        // 验证准入条件：企业是否存在重大行政处罚记录和重大涉诉涉案情况
        if (!legalStatus) {
            this.showError('error-legal-status', '请选择企业法律状态');
            isValid = false;
        } else if (legalStatus.value === 'yes') {
            this.showError('error-legal-status', '不符合准入要求：企业存在重大行政处罚记录或重大涉诉涉案情况');
            isValid = false;
        }
        
        return isValid;
    }

    // 验证烟草行业表单
    validateTobaccoForm() {
        this.hideAllErrors();
        let isValid = true;
        
        // 获取表单值
        const annualFlow = document.getElementById('tobacco-annual-flow').value;
        const salesCurrent = document.getElementById('tobacco-sales-current').value;
        const salesPrevious = document.getElementById('tobacco-sales-previous').value;
        const familyAssets = document.getElementById('tobacco-family-assets').value;
        const totalLiabilities = document.getElementById('tobacco-total-liabilities').value;
        const familyLiabilities = document.getElementById('tobacco-family-liabilities').value;
        const operationYears = document.getElementById('tobacco-operation-years').value;
        const recentOrderAmount = document.getElementById('tobacco-recent-order-amount').value;
        const maxMonthlyOrder = document.getElementById('tobacco-max-monthly-order').value;
        const retailIncome = document.getElementById('tobacco-retail-income').value;
        const legalStatus = document.querySelector('input[name="tobacco-legal-status"]:checked');
        const tobaccoLicense = document.querySelector('input[name="tobacco-license"]:checked');
        
        // 验证年经营流水
        const flowError = this.validatePositiveNumber(annualFlow, '年经营流水');
        if (flowError) {
            this.showError('error-tobacco-annual-flow', flowError);
            isValid = false;
        }
        
        // 验证近一年销售收入
        const currentError = this.validatePositiveNumber(salesCurrent, '近一年销售收入');
        if (currentError) {
            this.showError('error-tobacco-sales-current', currentError);
            isValid = false;
        }
        
        // 验证上一年销售收入
        const previousError = this.validatePositiveNumber(salesPrevious, '上一年销售收入');
        if (previousError) {
            this.showError('error-tobacco-sales-previous', previousError);
            isValid = false;
        }
        
        // 验证家庭资产
        const assetsError = this.validatePositiveNumber(familyAssets, '家庭资产');
        if (assetsError) {
            this.showError('error-tobacco-family-assets', assetsError);
            isValid = false;
        }
        
        // 验证总负债
        const totalError = this.validatePositiveNumber(totalLiabilities, '总负债');
        if (totalError) {
            this.showError('error-tobacco-total-liabilities', totalError);
            isValid = false;
        }
        
        // 验证家庭负债
        const familyError = this.validatePositiveNumber(familyLiabilities, '家庭负债');
        if (familyError) {
            this.showError('error-tobacco-family-liabilities', familyError);
            isValid = false;
        }
        
        // 验证经营年限（精确到0.5年，且必须大于等于1年）
        const yearsError = this.validateOperationYears(operationYears, '经营年限');
        if (yearsError) {
            this.showError('error-tobacco-operation-years', yearsError);
            isValid = false;
        } else {
            const years = parseFloat(operationYears);
            if (years < 1) {
                this.showError('error-tobacco-operation-years', '不符合准入要求：企业实际经营时间未满一年');
                isValid = false;
            }
        }
        
        // 验证近12个月订烟进货额
        const recentOrderError = this.validatePositiveNumber(recentOrderAmount, '近12个月订烟进货额');
        if (recentOrderError) {
            this.showError('error-tobacco-recent-order-amount', recentOrderError);
            isValid = false;
        }
        
        // 验证往年订烟量最高月份进货额
        const maxOrderError = this.validatePositiveNumber(maxMonthlyOrder, '往年订烟量最高月份进货额');
        if (maxOrderError) {
            this.showError('error-tobacco-max-monthly-order', maxOrderError);
            isValid = false;
        }
        
        // 验证近12个月零售类经营收入
        const retailError = this.validatePositiveNumber(retailIncome, '近12个月零售类经营收入');
        if (retailError) {
            this.showError('error-tobacco-retail-income', retailError);
            isValid = false;
        }
        
        // 验证准入条件：企业是否存在重大行政处罚记录和重大涉诉涉案情况
        if (!legalStatus) {
            this.showError('error-tobacco-legal-status', '请选择企业法律状态');
            isValid = false;
        } else if (legalStatus.value === 'yes') {
            this.showError('error-tobacco-legal-status', '不符合准入要求：企业存在重大行政处罚记录或重大涉诉涉案情况');
            isValid = false;
        }
        
        // 验证准入条件：是否取得烟草专卖零售许可证
        if (!tobaccoLicense) {
            this.showError('error-tobacco-license', '请选择是否取得烟草专卖零售许可证');
            isValid = false;
        } else if (tobaccoLicense.value === 'no') {
            this.showError('error-tobacco-license', '不符合准入要求：未取得烟草专卖局颁发的《烟草专卖零售许可证》');
            isValid = false;
        }
        
        return isValid;
    }

    // 验证零售百货行业表单
    validateRetailForm() {
        this.hideAllErrors();
        let isValid = true;
        
        // 获取表单值
        const annualFlow = document.getElementById('retail-annual-flow').value;
        const salesCurrent = document.getElementById('retail-sales-current').value;
        const salesPrevious = document.getElementById('retail-sales-previous').value;
        const familyAssets = document.getElementById('retail-family-assets').value;
        const totalLiabilities = document.getElementById('retail-total-liabilities').value;
        const familyLiabilities = document.getElementById('retail-family-liabilities').value;
        const operationYears = document.getElementById('retail-operation-years').value;
        const qualification = document.querySelector('input[name="retail-qualification"]:checked');
        const creditRecord = document.querySelector('input[name="retail-credit-record"]:checked');
        
        // 验证年经营流水
        const flowError = this.validatePositiveNumber(annualFlow, '年经营流水');
        if (flowError) {
            this.showError('error-retail-annual-flow', flowError);
            isValid = false;
        }
        
        // 验证近一年销售收入
        const currentError = this.validatePositiveNumber(salesCurrent, '近一年销售收入');
        if (currentError) {
            this.showError('error-retail-sales-current', currentError);
            isValid = false;
        }
        
        // 验证上一年销售收入
        const previousError = this.validatePositiveNumber(salesPrevious, '上一年销售收入');
        if (previousError) {
            this.showError('error-retail-sales-previous', previousError);
            isValid = false;
        }
        
        // 验证家庭资产
        const assetsError = this.validatePositiveNumber(familyAssets, '家庭资产');
        if (assetsError) {
            this.showError('error-retail-family-assets', assetsError);
            isValid = false;
        }
        
        // 验证总负债
        const totalError = this.validatePositiveNumber(totalLiabilities, '总负债');
        if (totalError) {
            this.showError('error-retail-total-liabilities', totalError);
            isValid = false;
        }
        
        // 验证家庭负债
        const familyError = this.validatePositiveNumber(familyLiabilities, '家庭负债');
        if (familyError) {
            this.showError('error-retail-family-liabilities', familyError);
            isValid = false;
        }
        
        // 验证经营年限（精确到0.5年，且必须大于等于1年）
        const yearsError = this.validateOperationYears(operationYears, '经营年限');
        if (yearsError) {
            this.showError('error-retail-operation-years', yearsError);
            isValid = false;
        } else {
            const years = parseFloat(operationYears);
            if (years < 1) {
                this.showError('error-retail-operation-years', '不符合准入要求：企业实际经营时间未满一年');
                isValid = false;
            }
        }
        
        // 验证准入条件：是否有固定经营场所、营业执照，持续经营1年以上，近1年无行政处罚或诉讼记录
        if (!qualification) {
            this.showError('error-retail-qualification', '请选择企业资格情况');
            isValid = false;
        } else if (qualification.value === 'no') {
            this.showError('error-retail-qualification', '不符合准入要求：需有固定经营场所、营业执照，持续经营1年以上，近1年无行政处罚或诉讼记录');
            isValid = false;
        }
        
        // 验证准入条件：近2年是否无严重逾期记录
        if (!creditRecord) {
            this.showError('error-retail-credit-record', '请选择信用记录情况');
            isValid = false;
        } else if (creditRecord.value === 'no') {
            this.showError('error-retail-credit-record', '不符合准入要求：近2年有严重逾期记录');
            isValid = false;
        }
        
        return isValid;
    }

    // 验证当前激活的表单
    validateCurrentForm(industry) {
        switch (industry) {
            case 'mechanical':
                return this.validateMechanicalForm();
            case 'tobacco':
                return this.validateTobaccoForm();
            case 'retail':
                return this.validateRetailForm();
            // 其他行业的验证逻辑将在后续扩展
            default:
                return this.validateMechanicalForm();
        }
    }
}

// 实例化验证器
const validator = new FormValidator();