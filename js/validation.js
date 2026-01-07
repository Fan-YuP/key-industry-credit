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
    
    // 验证果蔬仓储行业表单
    validateFruitStorageForm() {
        this.hideAllErrors();
        let isValid = true;
        
        // 获取表单值
        const annualFlow = document.getElementById('fruit-storage-annual-flow').value;
        const salesCurrent = document.getElementById('fruit-storage-sales-current').value;
        const salesPrevious = document.getElementById('fruit-storage-sales-previous').value;
        const familyAssets = document.getElementById('fruit-storage-family-assets').value;
        const totalLiabilities = document.getElementById('fruit-storage-total-liabilities').value;
        const familyLiabilities = document.getElementById('fruit-storage-family-liabilities').value;
        const operationYears = document.getElementById('fruit-storage-operation-years').value;
        const qualification = document.querySelector('input[name="fruit-storage-qualification"]:checked');
        
        // 验证年经营流水
        const flowError = this.validatePositiveNumber(annualFlow, '年经营流水');
        if (flowError) {
            this.showError('error-fruit-storage-annual-flow', flowError);
            isValid = false;
        }
        
        // 验证近一年销售收入
        const currentError = this.validatePositiveNumber(salesCurrent, '近一年销售收入');
        if (currentError) {
            this.showError('error-fruit-storage-sales-current', currentError);
            isValid = false;
        }
        
        // 验证上一年销售收入
        const previousError = this.validatePositiveNumber(salesPrevious, '上一年销售收入');
        if (previousError) {
            this.showError('error-fruit-storage-sales-previous', previousError);
            isValid = false;
        }
        
        // 验证家庭资产
        const assetsError = this.validatePositiveNumber(familyAssets, '家庭资产');
        if (assetsError) {
            this.showError('error-fruit-storage-family-assets', assetsError);
            isValid = false;
        }
        
        // 验证总负债
        const totalError = this.validatePositiveNumber(totalLiabilities, '总负债');
        if (totalError) {
            this.showError('error-fruit-storage-total-liabilities', totalError);
            isValid = false;
        }
        
        // 验证家庭负债
        const familyError = this.validatePositiveNumber(familyLiabilities, '家庭负债');
        if (familyError) {
            this.showError('error-fruit-storage-family-liabilities', familyError);
            isValid = false;
        }
        
        // 验证经营年限（精确到0.5年，且必须大于等于1年）
        const yearsError = this.validateOperationYears(operationYears, '经营年限');
        if (yearsError) {
            this.showError('error-fruit-storage-operation-years', yearsError);
            isValid = false;
        } else {
            const years = parseFloat(operationYears);
            if (years < 1) {
                this.showError('error-fruit-storage-operation-years', '不符合准入要求：企业实际经营时间未满一年');
                isValid = false;
            }
        }
        
        // 验证准入条件：持续经营1年以上，近1年无行政处罚或诉讼记录
        if (!qualification) {
            this.showError('error-fruit-storage-qualification', '请选择企业资格情况');
            isValid = false;
        } else if (qualification.value === 'no') {
            this.showError('error-fruit-storage-qualification', '不符合准入要求：需持续经营1年以上，近1年无行政处罚或诉讼记录');
            isValid = false;
        }
        
        return isValid;
    }
    
    // 验证苹果种植行业表单
    validateApplePlantingForm() {
        this.hideAllErrors();
        let isValid = true;
        
        // 获取表单值
        const annualFlow = document.getElementById('apple-planting-annual-flow').value;
        const salesCurrent = document.getElementById('apple-planting-sales-current').value;
        const salesPrevious = document.getElementById('apple-planting-sales-previous').value;
        const familyAssets = document.getElementById('apple-planting-family-assets').value;
        const totalLiabilities = document.getElementById('apple-planting-total-liabilities').value;
        const familyLiabilities = document.getElementById('apple-planting-family-liabilities').value;
        const operationYears = document.getElementById('apple-planting-operation-years').value;
        const acreage = document.getElementById('apple-planting-acreage').value;
        const experience = document.querySelector('input[name="apple-planting-experience"]:checked');
        
        // 验证年经营流水
        const flowError = this.validatePositiveNumber(annualFlow, '年经营流水');
        if (flowError) {
            this.showError('error-apple-planting-annual-flow', flowError);
            isValid = false;
        }
        
        // 验证近一年销售收入
        const currentError = this.validatePositiveNumber(salesCurrent, '近一年销售收入');
        if (currentError) {
            this.showError('error-apple-planting-sales-current', currentError);
            isValid = false;
        }
        
        // 验证上一年销售收入
        const previousError = this.validatePositiveNumber(salesPrevious, '上一年销售收入');
        if (previousError) {
            this.showError('error-apple-planting-sales-previous', previousError);
            isValid = false;
        }
        
        // 验证家庭资产
        const assetsError = this.validatePositiveNumber(familyAssets, '家庭资产');
        if (assetsError) {
            this.showError('error-apple-planting-family-assets', assetsError);
            isValid = false;
        }
        
        // 验证总负债
        const totalError = this.validatePositiveNumber(totalLiabilities, '总负债');
        if (totalError) {
            this.showError('error-apple-planting-total-liabilities', totalError);
            isValid = false;
        }
        
        // 验证家庭负债
        const familyError = this.validatePositiveNumber(familyLiabilities, '家庭负债');
        if (familyError) {
            this.showError('error-apple-planting-family-liabilities', familyError);
            isValid = false;
        }
        
        // 验证经营年限（精确到0.5年，且必须大于等于3年）
        const yearsError = this.validateOperationYears(operationYears, '经营年限');
        if (yearsError) {
            this.showError('error-apple-planting-operation-years', yearsError);
            isValid = false;
        } else {
            const years = parseFloat(operationYears);
            if (years < 3) {
                this.showError('error-apple-planting-operation-years', '不符合准入要求：需具备3年及以上种植经验');
                isValid = false;
            }
        }
        
        // 验证果树种植亩数
        const acreageError = this.validatePositiveNumber(acreage, '果树种植亩数');
        if (acreageError) {
            this.showError('error-apple-planting-acreage', acreageError);
            isValid = false;
        } else {
            const acreageValue = parseFloat(acreage);
            if (acreageValue < 10) {
                this.showError('error-apple-planting-acreage', '不符合准入要求：果树种植规模不低于10亩');
                isValid = false;
            }
        }
        
        // 验证准入条件：具备3年及以上种植经验，果树管理良好且具备固定住所或稳定经营场所
        if (!experience) {
            this.showError('error-apple-planting-experience', '请选择种植经验情况');
            isValid = false;
        } else if (experience.value === 'no') {
            this.showError('error-apple-planting-experience', '不符合准入要求：需具备3年及以上种植经验，果树管理良好且具备固定住所或稳定经营场所');
            isValid = false;
        }
        
        return isValid;
    }
    
    // 验证粮食购销行业表单
    validateGrainPurchaseForm() {
        this.hideAllErrors();
        let isValid = true;
        
        // 获取表单值
        const annualFlow = document.getElementById('grain-purchase-annual-flow').value;
        const salesCurrent = document.getElementById('grain-purchase-sales-current').value;
        const salesPrevious = document.getElementById('grain-purchase-sales-previous').value;
        const familyAssets = document.getElementById('grain-purchase-family-assets').value;
        const totalLiabilities = document.getElementById('grain-purchase-total-liabilities').value;
        const familyLiabilities = document.getElementById('grain-purchase-family-liabilities').value;
        const operationYears = document.getElementById('grain-purchase-operation-years').value;
        const qualification = document.querySelector('input[name="grain-purchase-qualification"]:checked');
        
        // 验证年经营流水
        const flowError = this.validatePositiveNumber(annualFlow, '年经营流水');
        if (flowError) {
            this.showError('error-grain-purchase-annual-flow', flowError);
            isValid = false;
        }
        
        // 验证近一年销售收入
        const currentError = this.validatePositiveNumber(salesCurrent, '近一年销售收入');
        if (currentError) {
            this.showError('error-grain-purchase-sales-current', currentError);
            isValid = false;
        }
        
        // 验证上一年销售收入
        const previousError = this.validatePositiveNumber(salesPrevious, '上一年销售收入');
        if (previousError) {
            this.showError('error-grain-purchase-sales-previous', previousError);
            isValid = false;
        }
        
        // 验证家庭资产
        const assetsError = this.validatePositiveNumber(familyAssets, '家庭资产');
        if (assetsError) {
            this.showError('error-grain-purchase-family-assets', assetsError);
            isValid = false;
        }
        
        // 验证总负债
        const totalError = this.validatePositiveNumber(totalLiabilities, '总负债');
        if (totalError) {
            this.showError('error-grain-purchase-total-liabilities', totalError);
            isValid = false;
        }
        
        // 验证家庭负债
        const familyError = this.validatePositiveNumber(familyLiabilities, '家庭负债');
        if (familyError) {
            this.showError('error-grain-purchase-family-liabilities', familyError);
            isValid = false;
        }
        
        // 验证经营年限（精确到0.5年，且必须大于等于1年）
        const yearsError = this.validateOperationYears(operationYears, '经营年限');
        if (yearsError) {
            this.showError('error-grain-purchase-operation-years', yearsError);
            isValid = false;
        } else {
            const years = parseFloat(operationYears);
            if (years < 1) {
                this.showError('error-grain-purchase-operation-years', '不符合准入要求：企业实际经营时间未满一年');
                isValid = false;
            }
        }
        
        // 验证准入条件：持续经营1年以上且近1年无行政处罚或诉讼记录
        if (!qualification) {
            this.showError('error-grain-purchase-qualification', '请选择企业资格情况');
            isValid = false;
        } else if (qualification.value === 'no') {
            this.showError('error-grain-purchase-qualification', '不符合准入要求：需持续经营1年以上且近1年无行政处罚或诉讼记录');
            isValid = false;
        }
        
        return isValid;
    }
    
    // 验证粮食加工行业表单
    validateGrainProcessingForm() {
        this.hideAllErrors();
        let isValid = true;
        
        // 获取表单值
        const annualFlow = document.getElementById('grain-processing-annual-flow').value;
        const salesCurrent = document.getElementById('grain-processing-sales-current').value;
        const salesPrevious = document.getElementById('grain-processing-sales-previous').value;
        const familyAssets = document.getElementById('grain-processing-family-assets').value;
        const totalLiabilities = document.getElementById('grain-processing-total-liabilities').value;
        const familyLiabilities = document.getElementById('grain-processing-family-liabilities').value;
        const operationYears = document.getElementById('grain-processing-operation-years').value;
        const qualification = document.querySelector('input[name="grain-processing-qualification"]:checked');
        
        // 验证年经营流水
        const flowError = this.validatePositiveNumber(annualFlow, '年经营流水');
        if (flowError) {
            this.showError('error-grain-processing-annual-flow', flowError);
            isValid = false;
        }
        
        // 验证近一年销售收入
        const currentError = this.validatePositiveNumber(salesCurrent, '近一年销售收入');
        if (currentError) {
            this.showError('error-grain-processing-sales-current', currentError);
            isValid = false;
        }
        
        // 验证上一年销售收入
        const previousError = this.validatePositiveNumber(salesPrevious, '上一年销售收入');
        if (previousError) {
            this.showError('error-grain-processing-sales-previous', previousError);
            isValid = false;
        }
        
        // 验证家庭资产
        const assetsError = this.validatePositiveNumber(familyAssets, '家庭资产');
        if (assetsError) {
            this.showError('error-grain-processing-family-assets', assetsError);
            isValid = false;
        }
        
        // 验证总负债
        const totalError = this.validatePositiveNumber(totalLiabilities, '总负债');
        if (totalError) {
            this.showError('error-grain-processing-total-liabilities', totalError);
            isValid = false;
        }
        
        // 验证家庭负债
        const familyError = this.validatePositiveNumber(familyLiabilities, '家庭负债');
        if (familyError) {
            this.showError('error-grain-processing-family-liabilities', familyError);
            isValid = false;
        }
        
        // 验证经营年限（精确到0.5年，且必须大于等于1年）
        const yearsError = this.validateOperationYears(operationYears, '经营年限');
        if (yearsError) {
            this.showError('error-grain-processing-operation-years', yearsError);
            isValid = false;
        } else {
            const years = parseFloat(operationYears);
            if (years < 1) {
                this.showError('error-grain-processing-operation-years', '不符合准入要求：企业实际经营时间未满一年');
                isValid = false;
            }
        }
        
        // 验证准入条件：持续经营1年以上且近1年无行政处罚或诉讼记录
        if (!qualification) {
            this.showError('error-grain-processing-qualification', '请选择企业资格情况');
            isValid = false;
        } else if (qualification.value === 'no') {
            this.showError('error-grain-processing-qualification', '不符合准入要求：需持续经营1年以上且近1年无行政处罚或诉讼记录');
            isValid = false;
        }
        
        return isValid;
    }

    // 验证粮食种植行业表单
    validateGrainPlantingForm() {
        this.hideAllErrors();
        let isValid = true;
        
        // 获取表单值
        const annualFlow = document.getElementById('grain-planting-annual-flow').value;
        const salesCurrent = document.getElementById('grain-planting-sales-current').value;
        const salesPrevious = document.getElementById('grain-planting-sales-previous').value;
        const familyAssets = document.getElementById('grain-planting-family-assets').value;
        const totalLiabilities = document.getElementById('grain-planting-total-liabilities').value;
        const familyLiabilities = document.getElementById('grain-planting-family-liabilities').value;
        const operationYears = document.getElementById('grain-planting-operation-years').value;
        const acreage = document.getElementById('grain-planting-acreage').value;
        const qualification = document.querySelector('input[name="grain-planting-qualification"]:checked');
        const landProof = document.querySelector('input[name="grain-planting-land-proof"]:checked');
        
        // 验证年经营流水
        const flowError = this.validatePositiveNumber(annualFlow, '年经营流水');
        if (flowError) {
            this.showError('error-grain-planting-annual-flow', flowError);
            isValid = false;
        }
        
        // 验证近一年销售收入
        const currentError = this.validatePositiveNumber(salesCurrent, '近一年销售收入');
        if (currentError) {
            this.showError('error-grain-planting-sales-current', currentError);
            isValid = false;
        }
        
        // 验证上一年销售收入
        const previousError = this.validatePositiveNumber(salesPrevious, '上一年销售收入');
        if (previousError) {
            this.showError('error-grain-planting-sales-previous', previousError);
            isValid = false;
        }
        
        // 验证家庭资产
        const assetsError = this.validatePositiveNumber(familyAssets, '家庭资产');
        if (assetsError) {
            this.showError('error-grain-planting-family-assets', assetsError);
            isValid = false;
        }
        
        // 验证总负债
        const totalError = this.validatePositiveNumber(totalLiabilities, '总负债');
        if (totalError) {
            this.showError('error-grain-planting-total-liabilities', totalError);
            isValid = false;
        }
        
        // 验证家庭负债
        const familyError = this.validatePositiveNumber(familyLiabilities, '家庭负债');
        if (familyError) {
            this.showError('error-grain-planting-family-liabilities', familyError);
            isValid = false;
        }
        
        // 验证经营年限（精确到0.5年，且必须大于等于1年）
        const yearsError = this.validateOperationYears(operationYears, '经营年限');
        if (yearsError) {
            this.showError('error-grain-planting-operation-years', yearsError);
            isValid = false;
        } else {
            const years = parseFloat(operationYears);
            if (years < 1) {
                this.showError('error-grain-planting-operation-years', '不符合准入要求：持续经营时间未满一年');
                isValid = false;
            }
        }
        
        // 验证粮食种植亩数
        const acreageError = this.validatePositiveNumber(acreage, '粮食种植亩数');
        if (acreageError) {
            this.showError('error-grain-planting-acreage', acreageError);
            isValid = false;
        }
        
        // 验证准入条件：持续经营1年以上且近1年无行政处罚或诉讼记录
        if (!qualification) {
            this.showError('error-grain-planting-qualification', '请选择经营资格情况');
            isValid = false;
        } else if (qualification.value === 'no') {
            this.showError('error-grain-planting-qualification', '不符合准入要求：需持续经营1年以上且近1年无行政处罚或诉讼记录');
            isValid = false;
        }
        
        // 验证准入条件：具有一定种植规模且具备土地承包合同和村委证明
        if (!landProof) {
            this.showError('error-grain-planting-land-proof', '请选择土地证明情况');
            isValid = false;
        } else if (landProof.value === 'no') {
            this.showError('error-grain-planting-land-proof', '不符合准入要求：需具有一定种植规模且具备土地承包合同和村委证明');
            isValid = false;
        }
        
        return isValid;
    }

    // 验证餐饮行业表单
    validateCateringForm() {
        this.hideAllErrors();
        let isValid = true;
        
        // 获取表单值
        const annualFlow = document.getElementById('catering-annual-flow').value;
        const salesCurrent = document.getElementById('catering-sales-current').value;
        const salesPrevious = document.getElementById('catering-sales-previous').value;
        const totalInvestment = document.getElementById('catering-total-investment').value;
        const familyAssets = document.getElementById('catering-family-assets').value;
        const totalLiabilities = document.getElementById('catering-total-liabilities').value;
        const familyLiabilities = document.getElementById('catering-family-liabilities').value;
        const operationYears = document.getElementById('catering-operation-years').value;
        const loanType = document.querySelector('input[name="catering-loan-type"]:checked');
        const qualification = document.querySelector('input[name="catering-qualification"]:checked');
        
        // 验证年经营流水
        const flowError = this.validatePositiveNumber(annualFlow, '年经营流水');
        if (flowError) {
            this.showError('error-catering-annual-flow', flowError);
            isValid = false;
        }
        
        // 验证近一年销售收入
        const currentError = this.validatePositiveNumber(salesCurrent, '近一年销售收入');
        if (currentError) {
            this.showError('error-catering-sales-current', currentError);
            isValid = false;
        }
        
        // 验证上一年销售收入
        const previousError = this.validatePositiveNumber(salesPrevious, '上一年销售收入');
        if (previousError) {
            this.showError('error-catering-sales-previous', previousError);
            isValid = false;
        }
        
        // 验证投资总成本
        const investmentError = this.validatePositiveNumber(totalInvestment, '投资总成本');
        if (investmentError) {
            this.showError('error-catering-total-investment', investmentError);
            isValid = false;
        }
        
        // 验证家庭资产
        const assetsError = this.validatePositiveNumber(familyAssets, '家庭资产');
        if (assetsError) {
            this.showError('error-catering-family-assets', assetsError);
            isValid = false;
        }
        
        // 验证总负债
        const totalError = this.validatePositiveNumber(totalLiabilities, '总负债');
        if (totalError) {
            this.showError('error-catering-total-liabilities', totalError);
            isValid = false;
        }
        
        // 验证家庭负债
        const familyError = this.validatePositiveNumber(familyLiabilities, '家庭负债');
        if (familyError) {
            this.showError('error-catering-family-liabilities', familyError);
            isValid = false;
        }
        
        // 验证经营年限（精确到0.5年，且必须大于等于1年）
        const yearsError = this.validateOperationYears(operationYears, '经营年限');
        if (yearsError) {
            this.showError('error-catering-operation-years', yearsError);
            isValid = false;
        } else {
            const years = parseFloat(operationYears);
            if (years < 1) {
                this.showError('error-catering-operation-years', '不符合准入要求：持续经营时间未满一年');
                isValid = false;
            }
        }
        
        // 验证贷款类型
        if (!loanType) {
            this.showError('error-catering-loan-type', '请选择贷款类型');
            isValid = false;
        }
        
        // 验证准入条件：持续经营1年以上且无行政处罚、诉讼记录及食品安全事故
        if (!qualification) {
            this.showError('error-catering-qualification', '请选择经营资格情况');
            isValid = false;
        } else if (qualification.value === 'no') {
            this.showError('error-catering-qualification', '不符合准入要求：需持续经营1年以上且无行政处罚、诉讼记录及食品安全事故');
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
            case 'fruit-storage':
                return this.validateFruitStorageForm();
            case 'apple-planting':
                return this.validateApplePlantingForm();
            case 'grain-purchase':
                return this.validateGrainPurchaseForm();
            case 'grain-processing':
                return this.validateGrainProcessingForm();
            case 'grain-planting':
                return this.validateGrainPlantingForm();
            case 'catering':
                return this.validateCateringForm();
            // 其他行业的验证逻辑将在后续扩展
            default:
                return this.validateMechanicalForm();
        }
    }
}

// 实例化验证器
const validator = new FormValidator();