// 主交互脚本
class CreditApp {
    constructor() {
        this.currentIndustry = 'mechanical';
        this.init();
    }

    // 初始化应用
    init() {
        this.bindEvents();
        this.initIndustryForm();
    }

    // 绑定事件
    bindEvents() {
        // 行业选择事件
        this.bindIndustryChange();
        // 行业搜索事件
        this.bindIndustrySearch();
        
        // 步骤1：下一步按钮
        const btnNext1 = document.getElementById('btn-next1');
        if (btnNext1) {
            btnNext1.addEventListener('click', () => this.goToStep2());
        }
        
        // 上一步按钮
        const btnBack = document.getElementById('btn-back');
        if (btnBack) {
            btnBack.addEventListener('click', () => this.goToStep1());
        }
        
        // 测算按钮
        const btnCalculate = document.getElementById('btn-calculate');
        if (btnCalculate) {
            btnCalculate.addEventListener('click', () => this.calculateCredit());
        }
        
        // 重新测算按钮
        const btnReset = document.getElementById('btn-reset');
        if (btnReset) {
            btnReset.addEventListener('click', () => this.resetApp());
        }
        
        // 表单输入事件（实时验证）
        this.bindFormInputEvents();
    }

    // 绑定行业选择事件
    bindIndustryChange() {
        const industrySelect = document.getElementById('industry-select');
        if (industrySelect) {
            industrySelect.addEventListener('change', (e) => {
                this.currentIndustry = e.target.value;
                this.updateSelectedIndustry();
                this.switchIndustryForm();
            });
        }
    }

    // 绑定行业搜索事件
    bindIndustrySearch() {
        const searchInput = document.getElementById('industry-search');
        const selectElement = document.getElementById('industry-select');
        
        if (searchInput && selectElement) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const options = selectElement.querySelectorAll('option');
                
                options.forEach(option => {
                    const text = option.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        option.style.display = '';
                    } else {
                        option.style.display = 'none';
                    }
                });
            });
        }
    }

    // 绑定表单输入事件
    bindFormInputEvents() {
        const formInputs = document.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                // 实时验证
                validator.hideAllErrors();
            });
        });
    }

    // 初始化行业表单
    initIndustryForm() {
        this.updateSelectedIndustry();
        this.switchIndustryForm();
    }

    // 更新选中的行业显示
    updateSelectedIndustry() {
        const industryMap = {
            'mechanical': '机械加工行业',
            'grain-purchase': '粮食购销行业',
            'grain-processing': '粮食加工行业',
            'grain-planting': '粮食种植行业',
            'apple-planting': '苹果种植行业',
            'fruit-storage': '果蔬仓储行业',
            'catering': '餐饮行业',
            'tobacco': '烟草行业',
            'retail': '零售百货行业'
        };
        
        const selectedIndustryElement = document.getElementById('selected-industry');
        if (selectedIndustryElement) {
            selectedIndustryElement.textContent = industryMap[this.currentIndustry] || '机械加工行业';
        }
    }

    // 切换行业表单
    switchIndustryForm() {
        // 隐藏所有行业表单
        const industryForms = document.querySelectorAll('.industry-form');
        industryForms.forEach(form => {
            form.classList.remove('active');
        });
        
        // 显示当前行业表单
        const currentForm = document.getElementById(`form-${this.currentIndustry}`);
        if (currentForm) {
            currentForm.classList.add('active');
        } else {
            // 默认显示机械加工行业表单
            const mechanicalForm = document.getElementById('form-mechanical');
            if (mechanicalForm) {
                mechanicalForm.classList.add('active');
            }
        }
    }

    // 进入步骤2：数据填写
    goToStep2() {
        // 获取当前选中的行业
        const industrySelect = document.getElementById('industry-select');
        if (industrySelect) {
            this.currentIndustry = industrySelect.value;
        }
        
        // 更新选中行业显示和表单
        this.updateSelectedIndustry();
        this.switchIndustryForm();
        
        // 切换到步骤2
        calculator.switchStep(2);
    }

    // 返回步骤1：行业选择
    goToStep1() {
        calculator.switchStep(1);
    }

    // 执行授信测算
    calculateCredit() {
        // 验证表单
        if (!validator.validateCurrentForm(this.currentIndustry)) {
            return;
        }
        
        // 获取表单数据
        const formData = calculator.getCurrentFormData(this.currentIndustry);
        
        // 执行测算
        const result = calculator.calculate(this.currentIndustry, formData);
        
        // 显示结果
        calculator.showResult(this.currentIndustry, formData, result);
    }

    // 重置应用
    resetApp() {
        // 重置表单
        const formInputs = document.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.value = '';
        });
        
        // 重置行业选择
        const industrySelect = document.getElementById('industry-select');
        if (industrySelect) {
            industrySelect.value = 'mechanical';
        }
        
        // 重置搜索框
        const searchInput = document.getElementById('industry-search');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // 重置所有选项的显示
        const options = document.querySelectorAll('#industry-select option');
        options.forEach(option => {
            option.style.display = '';
        });
        
        // 重置当前行业
        this.currentIndustry = 'mechanical';
        this.updateSelectedIndustry();
        this.switchIndustryForm();
        
        // 隐藏错误信息
        validator.hideAllErrors();
        
        // 返回步骤1
        calculator.switchStep(1);
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 初始化应用
    window.creditApp = new CreditApp();
    
    // 微信浏览器兼容性处理
    if (navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
        // 微信浏览器特定处理
        console.log('微信浏览器环境');
    }
});

// 防止页面后退
window.addEventListener('popstate', (e) => {
    e.preventDefault();
    // 根据当前步骤决定是否允许后退
    const currentStep = document.querySelector('.step.active');
    if (currentStep && currentStep.id === 'step3') {
        // 在结果页面，允许返回数据填写页面
        window.creditApp.goToStep2();
    } else if (currentStep && currentStep.id === 'step2') {
        // 在数据填写页面，允许返回行业选择页面
        window.creditApp.goToStep1();
    }
});