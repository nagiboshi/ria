const BaseController = require('../controllers/base-controller');
const errorService = require('./error-service');


class TestService extends BaseController {
  constructor() {
    super();
  }
  
  initReportTest() {
    //результирующий объект после анализа результатов
    this.reportTest = {
      section1: {
        oncology: {
          averageRisk: {
            minSymptoms: 2,
            symptoms: 0
          },
          highRisk: {
            minSymptoms: 4,
            symptoms: 0
          },
          resultRisk: 0
        },
        diabetes: {
          averageRisk: {
            minSymptoms: 2,
            symptoms: 0
          },
          highRisk: {
            minSymptoms: 4,
            symptoms: 0
          },
          resultRisk: 0
        },
        cardiovascular: {
          averageRisk: {
            minSymptoms: 2,
            symptoms: 0
          },
          highRisk: {
            minSymptoms: 4,
            symptoms: 0
          },
          resultRisk: 0
        },
        psychosomatic: {
          averageRisk: {
            minSymptoms: 2,
            symptoms: 0
          },
          highRisk: {
            minSymptoms: 4,
            symptoms: 0
          },
          resultRisk: 0
        }
      },
      section2: {
        age: null,
        sex: null,
        height: null,
        weight: null,
        massIndex: null,
        pressure: null,
        cholesterol: null,
        lpnp: null,
        lpvp: null,
        glucoseCapillaryBlood: null,
        presenceHeredityOfDiseases: null,
        medicalCheckupTherapist: null,
        medicalCheckupDentist: null,
        physicalActivity: null,
        smoking: null,
        secondHandSmoke: null,
        alcohol: null,
        fattyFood: null,
        fruitsVegetables: null,
        alimentaryFiber: null,
        stress: null,
        depression: null,
        satisfactionPrivacyLife: null,
        satisfactionProfessionalLife: null
      },
      section3: {
        demographicIndicators: [],
        hereditaryIncidence: [],
        healthScreening: [],
        medicalCheckups: [],
        toothHealth: [],
        lifeStyle: []
      },
      section4: {},
      section5: {},
    };
  }
  
  prepareResultTest(resultTest) {
    //подготовка результатов теста для анализа
    let resultList = resultTest.result.split(',');
    console.log("resultList", resultList);
    this.objResult = {};
    resultList.forEach(item => {
      let listItemAnswer = item.split(':');
      if(!this.objResult[listItemAnswer[0]]) {
        this.objResult[listItemAnswer[0]] = [listItemAnswer.splice(1, listItemAnswer.length - 1).join(':')];
      } else {
        let concatList = listItemAnswer.splice(1, listItemAnswer.length - 1).join(':');
        this.objResult[listItemAnswer[0]] = this.objResult[listItemAnswer[0]].concat([concatList]);
      }
    });
    this.weight = parseFloat(this.objResult['13'][0]); // вес
    this.height =  parseFloat(this.objResult['14'][0]); // рост см
    this.age = parseFloat(this.objResult['4'][0]); // возраст
    this.sex = parseInt(this.objResult['5'][0]); // пол 1 мужской, 2 женский
    this.massIndex = (this.weight / ((this.height / 100) * (this.height / 100))).toFixed(2); //индекс массы тела
    //конец поготовки результатов теста для анализа
  }

  checkQuestionAnswerAndAddRisk(questionNumber, answerValue, type, fieldRisk) {
    if(this.objResult[questionNumber]) {
      if (type === 'equal') {
        if (this.objResult[questionNumber].indexOf(answerValue) !== -1) {
          fieldRisk.symptoms++;
        }
      }
      if (type === 'more') {
        if (parseInt(this.objResult[questionNumber]) > answerValue) {
          fieldRisk.symptoms++;
        }
      }
      if (type === 'less') {
        if (parseInt(this.objResult[questionNumber]) < answerValue) {
          fieldRisk.symptoms++;
        }
      }
    }
  }

  checkQuestionAnswer(questionNumber, answerValue, type) {
    if(this.objResult[questionNumber]) {
      if (type === 'equal') {
        if (this.objResult[questionNumber].indexOf(answerValue) !== -1) {
          return true;
        }
      }
      if (type === 'more') {
        if (parseInt(this.objResult[questionNumber]) > answerValue) {
          return true;
        }
      }
      if (type === 'less') {
        if (parseInt(this.objResult[questionNumber]) < answerValue) {
          return true;
        }
      }
      if(this.objResult[questionNumber][0]) {
        if (type === 'moreValue') {
          if (parseInt(this.objResult[questionNumber][0]) > answerValue) {
            return true;
          }
        }
        if (type === 'lessValue') {
          if (parseInt(this.objResult[questionNumber][0]) < answerValue) {
            return true;
          }
        }
      }
    }
    return false;
  }

  async prepareDataForReportTest(req, res, next) {
    try {
      if(!req.resultTest) {
        throw errorService.test.notResult;
      }
      this.initReportTest();
      this.prepareResultTest(req.resultTest);

      //секция 1 онкология
      if(this.age > 40) this.reportTest.section1.oncology.averageRisk.symptoms ++;
      if(this.massIndex > 29.9) {
        this.reportTest.section1.oncology.highRisk.symptoms ++;
      } else
      if(this.massIndex > 24.9) {
        this.reportTest.section1.oncology.averageRisk.symptoms ++;
      }
      this.checkQuestionAnswerAndAddRisk('24', '5', 'equal', this.reportTest.section1.oncology.highRisk);
      this.checkQuestionAnswerAndAddRisk('25', '1', 'equal', this.reportTest.section1.oncology.highRisk);
      this.checkQuestionAnswerAndAddRisk('25', '1', 'equal', this.reportTest.section1.oncology.averageRisk);
      this.checkQuestionAnswerAndAddRisk('29', '1:4', 'equal', this.reportTest.section1.oncology.highRisk);
      this.checkQuestionAnswerAndAddRisk('29', '6:4', 'equal', this.reportTest.section1.oncology.highRisk);
      if(this.sex === 2) {
        this.checkQuestionAnswerAndAddRisk('29', '4:4', 'equal', this.reportTest.section1.oncology.highRisk);
      }
      if(this.checkQuestionAnswer('31', '1', 'equal') && this.checkQuestionAnswer('32', 10, 'lessValue') && this.checkQuestionAnswer('33', 10, 'lessValue')) {
        this.reportTest.section1.oncology.averageRisk.symptoms ++;
      } else
      if(this.checkQuestionAnswer('31', 0, 'moreValue') && this.checkQuestionAnswer('31', 7, 'lessValue')) {
        this.reportTest.section1.oncology.highRisk.symptoms ++;
      }
      this.checkQuestionAnswerAndAddRisk('34', '1', 'equal', this.reportTest.section1.oncology.averageRisk);
      this.checkQuestionAnswerAndAddRisk('35', 9, 'more', this.reportTest.section1.oncology.averageRisk);
      this.checkQuestionAnswerAndAddRisk('36', '2', 'equal', this.reportTest.section1.oncology.averageRisk);
      this.checkQuestionAnswerAndAddRisk('36', '3', 'equal', this.reportTest.section1.oncology.highRisk);
      this.checkQuestionAnswerAndAddRisk('36', '4', 'equal', this.reportTest.section1.oncology.highRisk);
      this.checkQuestionAnswerAndAddRisk('37', '3', 'equal', this.reportTest.section1.oncology.averageRisk);
      this.checkQuestionAnswerAndAddRisk('37', '4', 'equal', this.reportTest.section1.oncology.highRisk);
      this.checkQuestionAnswerAndAddRisk('38', '2', 'equal', this.reportTest.section1.oncology.averageRisk);
      this.checkQuestionAnswerAndAddRisk('38', '1', 'equal', this.reportTest.section1.oncology.highRisk);
      this.checkQuestionAnswerAndAddRisk('45', '4', 'equal', this.reportTest.section1.oncology.averageRisk);
      this.checkQuestionAnswerAndAddRisk('45', '4', 'equal', this.reportTest.section1.oncology.highRisk);

      if(this.reportTest.section1.oncology.highRisk.symptoms >= this.reportTest.section1.oncology.highRisk.minSymptoms) {
        this.reportTest.section1.oncology.resultRisk = 3;
      } else
      if(this.reportTest.section1.oncology.averageRisk.symptoms >= this.reportTest.section1.oncology.averageRisk.minSymptoms){
        this.reportTest.section1.oncology.resultRisk = 2;
      } else {
        this.reportTest.section1.oncology.resultRisk = 1;
      }
      //секция 1 диабет
      if(this.age > 40) this.reportTest.section1.diabetes.averageRisk.symptoms ++;
      if(this.massIndex > 29.9) {
        this.reportTest.section1.diabetes.highRisk.symptoms ++;
      } else
      if(this.massIndex > 24.9) {
        this.reportTest.section1.diabetes.averageRisk.symptoms ++;
      }
      this.checkQuestionAnswerAndAddRisk('17', '2', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('17', '3', 'equal', this.reportTest.section1.diabetes.highRisk);
      this.checkQuestionAnswerAndAddRisk('18', '2', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('18', '3', 'equal', this.reportTest.section1.diabetes.highRisk);
      this.checkQuestionAnswerAndAddRisk('19', '2', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('19', '3', 'equal', this.reportTest.section1.diabetes.highRisk);
      this.checkQuestionAnswerAndAddRisk('20', '2', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('20', '3', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('21', '2', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('21', '3', 'equal', this.reportTest.section1.diabetes.highRisk);
      this.checkQuestionAnswerAndAddRisk('21', '4', 'equal', this.reportTest.section1.diabetes.highRisk);
      this.checkQuestionAnswerAndAddRisk('22', '2', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('24', '9', 'equal', this.reportTest.section1.diabetes.highRisk);
      this.checkQuestionAnswerAndAddRisk('25', '3', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('25', '3', 'equal', this.reportTest.section1.diabetes.highRisk);
      this.checkQuestionAnswerAndAddRisk('37', '3', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('37', '4', 'equal', this.reportTest.section1.diabetes.highRisk);
      this.checkQuestionAnswerAndAddRisk('38', '2', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('38', '1', 'equal', this.reportTest.section1.diabetes.highRisk);
      this.checkQuestionAnswerAndAddRisk('41', '2', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('41', '1', 'equal', this.reportTest.section1.diabetes.highRisk);
      this.checkQuestionAnswerAndAddRisk('42', '2', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('42', '1', 'equal', this.reportTest.section1.diabetes.highRisk);
      this.checkQuestionAnswerAndAddRisk('43', '2', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('43', '3', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('43', '4', 'equal', this.reportTest.section1.diabetes.highRisk);
      this.checkQuestionAnswerAndAddRisk('45', '3', 'equal', this.reportTest.section1.diabetes.averageRisk);
      this.checkQuestionAnswerAndAddRisk('45', '4', 'equal', this.reportTest.section1.diabetes.highRisk);

      if(this.reportTest.section1.diabetes.highRisk.symptoms >= this.reportTest.section1.diabetes.highRisk.minSymptoms) {
        this.reportTest.section1.diabetes.resultRisk = 3;
      } else
      if(this.reportTest.section1.diabetes.averageRisk.symptoms >= this.reportTest.section1.diabetes.averageRisk.minSymptoms){
        this.reportTest.section1.diabetes.resultRisk = 2;
      } else {
        this.reportTest.section1.diabetes.resultRisk = 1;
      }
      //секция 1 Болезни сердечно-сосудистой системы
      if(this.age > 40) this.reportTest.section1.cardiovascular.averageRisk.symptoms ++;
      if(this.massIndex > 29.9) {
        this.reportTest.section1.cardiovascular.highRisk.symptoms ++;
      } else
      if(this.massIndex > 24.9) {
        this.reportTest.section1.cardiovascular.averageRisk.symptoms ++;
      }
      this.checkQuestionAnswerAndAddRisk('13', '2', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('13', '3', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('14', '2', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('17', '2', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('17', '3', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('18', '2', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('18', '3', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('18', '4', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('19', '2', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('19', '3', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('24', '10', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('24', '12', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('24', '13', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('24', '18', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('25', '2', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('25', '2', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      if(this.checkQuestionAnswer('31', '1', 'equal') && this.checkQuestionAnswer('32', 10, 'lessValue') && this.checkQuestionAnswer('33', 10, 'lessValue')) {
        this.reportTest.section1.cardiovascular.averageRisk.symptoms ++;
      } else
      if(this.checkQuestionAnswer('31', 0, 'moreValue') && this.checkQuestionAnswer('31', 7, 'lessValue')) {
        this.reportTest.section1.cardiovascular.highRisk.symptoms ++;
      }
      if(this.checkQuestionAnswer('32', 0, 'moreValue')) {
        this.checkQuestionAnswerAndAddRisk('32', 12, 'less', this.reportTest.section1.cardiovascular.averageRisk);
        this.checkQuestionAnswerAndAddRisk('32', 12, 'more', this.reportTest.section1.cardiovascular.highRisk);
      }
      this.checkQuestionAnswerAndAddRisk('34', '1', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('35', 9, 'more', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('36', '2', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('36', '3', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('36', '4', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('37', '3', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('37', '4', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('38', '2', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('38', '1', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('41', '2', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('41', '1', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('42', '2', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('42', '1', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('43', '2', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('43', '3', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('43', '4', 'equal', this.reportTest.section1.cardiovascular.highRisk);
      this.checkQuestionAnswerAndAddRisk('45', '3', 'equal', this.reportTest.section1.cardiovascular.averageRisk);
      this.checkQuestionAnswerAndAddRisk('45', '4', 'equal', this.reportTest.section1.cardiovascular.highRisk);

      if(this.reportTest.section1.cardiovascular.highRisk.symptoms >= this.reportTest.section1.cardiovascular.highRisk.minSymptoms) {
        this.reportTest.section1.cardiovascular.resultRisk = 3;
      } else
      if(this.reportTest.section1.cardiovascular.averageRisk.symptoms >= this.reportTest.section1.cardiovascular.averageRisk.minSymptoms){
        this.reportTest.section1.cardiovascular.resultRisk = 2;
      } else {
        this.reportTest.section1.cardiovascular.resultRisk = 1;
      }
      //секция 1 психоматические заболевания
      this.checkQuestionAnswerAndAddRisk('6', '2', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('6', '2', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('7', '4', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('8', '2', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('8', '3', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('9', '3', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('9', '4', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('10', '1', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('10', '3', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('10', '1', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('10', '3', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('24', '7', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('24', '8', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('24', '17', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('25', '4', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('25', '4', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('35', 9, 'more', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('36', '2', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('36', '3', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('36', '4', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('41', '2', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('41', '1', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('42', '2', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('42', '1', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('43', '2', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('43', '3', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('43', '4', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('45', '3', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('45', '4', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('46', '2', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('46', '3', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('47', '3', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('47', '4', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('48', '3', 'equal', this.reportTest.section1.psychosomatic.averageRisk);
      this.checkQuestionAnswerAndAddRisk('48', '4', 'equal', this.reportTest.section1.psychosomatic.highRisk);
      this.checkQuestionAnswerAndAddRisk('49', '1', 'equal', this.reportTest.section1.psychosomatic.highRisk);

      if(this.reportTest.section1.psychosomatic.highRisk.symptoms >= this.reportTest.section1.psychosomatic.highRisk.minSymptoms) {
        this.reportTest.section1.psychosomatic.resultRisk = 3;
      } else
      if(this.reportTest.section1.psychosomatic.averageRisk.symptoms >= this.reportTest.section1.psychosomatic.averageRisk.minSymptoms){
        this.reportTest.section1.psychosomatic.resultRisk = 2;
      } else {
        this.reportTest.section1.psychosomatic.resultRisk = 1;
      }
      //секция 2
      this.reportTest.section2.age = this.age;
      this.reportTest.section2.sex = (this.sex === 1) ? 'Мужской' : 'Женский';
      this.reportTest.section2.height = this.height + ' сантиметров';
      this.reportTest.section2.weight = this.weight + ' килограм';
      this.reportTest.section2.massIndex = this.massIndex;
      if(this.checkQuestionAnswer('15', '1', 'equal')) {
        this.reportTest.section2.pressure = '120/80'
      } else
      if(this.checkQuestionAnswer('15', '2', 'equal')) {
        this.reportTest.section2.pressure = 'от 120/80 до 139/89';
      } else
      if(this.checkQuestionAnswer('15', '3', 'equal')) {
        this.reportTest.section2.pressure = 'от 140/90';
      } else {
        this.reportTest.section2.pressure = 'Нет данных';
      }
      if(this.checkQuestionAnswer('17', '1', 'equal')) {
        this.reportTest.section2.cholesterol = 'менее 5'
      } else
      if(this.checkQuestionAnswer('17', '2', 'equal')) {
        this.reportTest.section2.cholesterol = '5-6.4';
      } else
      if(this.checkQuestionAnswer('17', '3', 'equal')) {
        this.reportTest.section2.cholesterol = 'более 6.5';
      } else {
        this.reportTest.section2.cholesterol = 'Нет данных';
      }
      if(this.checkQuestionAnswer('18', '1', 'equal')) {
        this.reportTest.section2.lpnp = '2.5-3.5'
      } else
      if(this.checkQuestionAnswer('18', '2', 'equal')) {
        this.reportTest.section2.lpnp = '3.5-4';
      } else
      if(this.checkQuestionAnswer('18', '3', 'equal')) {
        this.reportTest.section2.lpnp = 'больше 4';
      } else {
        this.reportTest.section2.lpnp = 'Нет данных';
      }
      if(this.checkQuestionAnswer('19', '1', 'equal')) {
        this.reportTest.section2.lpvp = 'более 1.5'
      } else
      if(this.checkQuestionAnswer('19', '2', 'equal')) {
        this.reportTest.section2.lpvp = '1-1.5';
      } else
      if(this.checkQuestionAnswer('19', '3', 'equal')) {
        this.reportTest.section2.lpvp = 'менее 1';
      } else {
        this.reportTest.section2.lpvp = 'Нет данных';
      }
      if(this.checkQuestionAnswer('21', '1', 'equal')) {
        this.reportTest.section2.glucoseCapillaryBlood = 'менее 5.5'
      } else
      if(this.checkQuestionAnswer('21', '2', 'equal')) {
        this.reportTest.section2.glucoseCapillaryBlood = '5.5-6.7';
      } else
      if(this.checkQuestionAnswer('21', '3', 'equal')) {
        this.reportTest.section2.glucoseCapillaryBlood = 'больше 6.7';
      } else {
        this.reportTest.section2.glucoseCapillaryBlood = 'Нет данных';
      }
      if(!this.objResult['25'] || this.objResult['25'].length === 0) {
        this.reportTest.section2.presenceHeredityOfDiseases = 'Отсутствие';
      } else {
        this.reportTest.section2.presenceHeredityOfDiseases = 'Наличие';
      }
      if(this.checkQuestionAnswer('29', '1:1', 'equal')) {
        this.reportTest.section2.medicalCheckupTherapist = 'Не более двух лет назад';
      } else
      if(this.checkQuestionAnswer('29', '1:2', 'equal')){
        this.reportTest.section2.medicalCheckupTherapist = '2-4 года назад';
      } else
      if(this.checkQuestionAnswer('29', '1:3', 'equal')){
        this.reportTest.section2.medicalCheckupTherapist = 'Более 4 лет назад'
      } else {
        this.reportTest.section2.medicalCheckupTherapist = 'Никогда/не знаю';
      }
      if(this.checkQuestionAnswer('29', '3:1', 'equal')) {
        this.reportTest.section2.medicalCheckupDentist = 'Не более двух лет назад';
      } else
      if(this.checkQuestionAnswer('29', '3:2', 'equal')){
        this.reportTest.section2.medicalCheckupDentist = '2-4 года назад';
      } else
      if(this.checkQuestionAnswer('29', '3:3', 'equal')){
        this.reportTest.section2.medicalCheckupDentist = 'Более 4 лет назад';
      } else {
        this.reportTest.section2.medicalCheckupDentist = 'Никогда/не знаю';
      }
      if(this.checkQuestionAnswer('44', '1', 'equal') || this.checkQuestionAnswer('44', '2', 'equal')) {
        this.reportTest.section2.physicalActivity = 'Низкая';
      } else
      if(this.checkQuestionAnswer('44', '3', 'equal')) {
        this.reportTest.section2.physicalActivity = 'Средняя';
      } else
      if(this.checkQuestionAnswer('44', '4', 'equal')) {
        this.reportTest.section2.physicalActivity = 'Высокая';
      }
      if(this.checkQuestionAnswer('31', 0, 'moreValue') && this.checkQuestionAnswer('31', 8, 'lessValue')) {
        this.reportTest.section2.smoking = 'Наличие';
      } else
      {
        this.reportTest.section2.smoking = 'Отсутствие';
      }
      if(this.checkQuestionAnswer('34', '1', 'equal')) {
        this.reportTest.section2.secondHandSmoke = 'Наличие';
      } else
      if(this.checkQuestionAnswer('34', '2', 'equal')){
        this.reportTest.section2.secondHandSmoke = 'Отсутствие';
      } else
      if(this.checkQuestionAnswer('34', '3', 'equal')){
        this.reportTest.section2.secondHandSmoke = 'Нет данных';
      }
      if(this.checkQuestionAnswer('35', 3, 'lessValue')) {
        this.reportTest.section2.alcohol = 'Редко';
      } else
      if(this.checkQuestionAnswer('35', 5, 'lessValue')){
        this.reportTest.section2.alcohol = 'не очень часто';
      } else
      if(this.checkQuestionAnswer('35', 9, 'lessValue')){
        this.reportTest.section2.alcohol = 'часто';
      } else {
        this.reportTest.section2.alcohol = 'очень часто';
      }
      if(this.checkQuestionAnswer('39', '1', 'equal')) {
        this.reportTest.section2.fattyFood = 'высокое потребление';
      } else
      if(this.checkQuestionAnswer('39', '2', 'equal')) {
        this.reportTest.section2.fattyFood = 'среднее потребление';
      } else
      if(this.checkQuestionAnswer('39', '3', 'equal')) {
        this.reportTest.section2.fattyFood = 'нормальное потребление';
      } else
      if(this.checkQuestionAnswer('39', '4', 'equal')) {
        this.reportTest.section2.fattyFood = 'низкое потребление';
      }
      if(this.checkQuestionAnswer('37', '1', 'equal')) {
        this.reportTest.section2.fruitsVegetables = '5-6 порций';
      } else
      if(this.checkQuestionAnswer('37', '2', 'equal')) {
        this.reportTest.section2.fruitsVegetables = '3-4 порции';
      } else
      if(this.checkQuestionAnswer('37', '3', 'equal')) {
        this.reportTest.section2.fruitsVegetables = '1-2 порции';
      } else
      if(this.checkQuestionAnswer('37', '4', 'equal')) {
        this.reportTest.section2.fruitsVegetables = 'Редко/никогда';
      }
      if(this.checkQuestionAnswer('38', '1', 'equal')) {
        this.reportTest.section2.alimentaryFiber = '5-6 порций';
      } else
      if(this.checkQuestionAnswer('38', '2', 'equal')) {
        this.reportTest.section2.alimentaryFiber = '3-4 порции';
      } else
      if(this.checkQuestionAnswer('38', '3', 'equal')) {
        this.reportTest.section2.alimentaryFiber = '1-2 порции';
      } else
      if(this.checkQuestionAnswer('38', '4', 'equal')) {
        this.reportTest.section2.alimentaryFiber = 'Редко/никогда';
      }
      if(this.checkQuestionAnswer('48', '1', 'equal')) {
        this.reportTest.section2.stress = 'Низкий уровень';
      } else
      if(this.checkQuestionAnswer('48', '2', 'equal')) {
        this.reportTest.section2.stress = 'средний уровень';
      } else
      if(this.checkQuestionAnswer('48', '3', 'equal')) {
        this.reportTest.section2.stress = 'высокий уровень';
      } else
      if(this.checkQuestionAnswer('48', '4', 'equal')) {
        this.reportTest.section2.stress = 'очень высокий';
      }
      if(this.checkQuestionAnswer('52', '1', 'equal')) {
        this.reportTest.section2.depression = 'наличие';
      } else {
        this.reportTest.section2.depression = 'Отсутствие';
      }
      if(this.checkQuestionAnswer('50', '1', 'equal')) {
        this.reportTest.section2.satisfactionPrivacyLife = 'Высокая';
      } else
      if(this.checkQuestionAnswer('50', '2', 'equal')) {
        this.reportTest.section2.satisfactionPrivacyLife = 'Средняя';
      } else
      if(this.checkQuestionAnswer('50', '3', 'equal')) {
        this.reportTest.section2.satisfactionPrivacyLife = 'Пониженная';
      } else
      if(this.checkQuestionAnswer('50', '4', 'equal')) {
        this.reportTest.section2.satisfactionPrivacyLife = 'Низкая';
      }
      if(this.checkQuestionAnswer('51', '1', 'equal')) {
        this.reportTest.section2.satisfactionProfessionalLife = 'Высокая';
      } else
      if(this.checkQuestionAnswer('51', '2', 'equal')) {
        this.reportTest.section2.satisfactionProfessionalLife = 'Средняя';
      } else
      if(this.checkQuestionAnswer('51', '3', 'equal')) {
        this.reportTest.section2.satisfactionProfessionalLife = 'Пониженная';
      } else
      if(this.checkQuestionAnswer('51', '4', 'equal')) {
        this.reportTest.section2.satisfactionProfessionalLife = 'Низкая';
      }

      //секция 3
      this.reportTest.section3.demographicIndicators.push("Возраст. Возраст может быть связан с развитием некоторых заболеваний, таких как  сердечно-сосудистые заболевания, а также инсульт, диабет, онкология. В некоторых исследованиях, риск различен у женщин и мужчин.");
      if(this.sex === 1 && this.age > 40) {
        this.reportTest.section3.demographicIndicators.push("Женщины, возраст которых превосходит 40-44 года, находятся в зоне риска. Для женщин старше 40 важно уделять внимание профилактики стресса, т.к. многие исследования показали, что женщины данного возраста подвержены возникновению психологических нарушений.");
      }
      if(this.sex === 2 && this.age > 40) {
        this.reportTest.section3.demographicIndicators.push("Мужчины, возраст которых превосходит 40-44 года, находятся в зоне риска.");
      }
      //
      if(this.checkQuestionAnswer('25', '1', 'equal')) {
        this.reportTest.section3.hereditaryIncidence.push("Онкология.  Вы указали, что Ваш родственник имел диагноз «онкология». Некоторые заболевания могут передаваться по наследству. Регулярно проходите профилактические осмотры, такие как общий онкологический осмотр, контроль онкомаркеров, флюорографию и маммографию (для женщин). После 40 лет необходимо проходить данную диагностику ежегодно.");
      }
      if(this.checkQuestionAnswer('25', '2', 'equal')) {
        this.reportTest.section3.hereditaryIncidence.push("Сердечно-сосудистые заболевания. Вы указали, что Ваш родственник болел сердечно-сосудистыми заболеваниями. Некоторые болезни могут передаваться по наследству. Регулярно проходите профилактические осмотры, и  сдавайте анализы, такие как измерение давление, анализ крови на холестерин, глюкозу, ЛПНП, ЛПВП. После 40 лет необходимо проходить диагностику ежегодно.");
      }
      if(this.checkQuestionAnswer('25', '3', 'equal')) {
        this.reportTest.section3.hereditaryIncidence.push("Диабет. Вы указали, что Ваш родственник болел диабетом. Некоторые болезни могут передаваться по наследству. Регулярно проходите профилактические осмотры и сдавайте анализы, такие как анализ крови на уровень глюкозы, холестерин.");
      }
      if(this.checkQuestionAnswer('25', '4', 'equal')) {
        this.reportTest.section3.hereditaryIncidence.push("Хроническая депрессия. Вы указали, что Ваш родственник страдал хронической депрессией. Некоторые заболевания могут передаваться по наследству, своевременно проходите профилактические осмотры для выявления заболевания на ранней стадии.");
      }
      //
      if(this.checkQuestionAnswer('13', '1', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что уровень Вашего артериального давления 120/80 , что соответствует норме.");
      }
      if(this.checkQuestionAnswer('13', '2', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что ваше артериальное давление от 120/80 до 139/89, что говорит о повышенных значениях артериального давления. Следите за Вашим давлением, если оно будет повышаться – необходимо обратиться к Вашему лечащему врачу.");
      }
      if(this.checkQuestionAnswer('13', '3', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что ваше артериальное давление более 140/80, что говорит о высоких показателях артериального давления, превышающих норму. Вам необходимо обратиться к лечащему врачу.");
      }
      if(this.checkQuestionAnswer('13', '4', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что не знаете свой уровень артериального давления или забыли его показатели. В профилактических целях необходимо измерять свое артериальное давление не реже 1 раза в месяц, особенно если Вы достигли возраста 40 лет. При этом, если Вы иногда испытываете головные боли, мелькание мушек, головокружение, учащенное сердцебиение,  то Вам необходимо измерить Ваше давление и если оно будет повышенным, то обратиться к лечащему врачу.");
      }
      if(this.checkQuestionAnswer('17', '1', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что уровень холестерина менее 5 ммоль/л, что соответствует норме. Поддерживайте значения холестерина менее 5 ммоль/л, чтобы предотвратить развитие сердечно-сосудистых заболеваний.");
      }
      if(this.checkQuestionAnswer('17', '2', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что уровень холестерина находится в зоне от 5 до 6.4 ммоль/л, что соответствует пограничной зоне. Рекомендованное значение уровня холестерина ниже 5 ммоль/л. Высокий уровень холестерина – высокий уровень вероятности возникновения сердечно-сосудистых заболеваний.");
      }
      if(this.checkQuestionAnswer('17', '3', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что уровень холестерина находится в зоне более 6.5 ммоль/л, что превышает норму. Рекомендованное значение уровня холестерина ниже 5 ммоль/л. Высокий уровень холестерина – большая вероятность возникновения сердечно-сосудистых заболеваний.");
      }
      if(this.checkQuestionAnswer('17', '4', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что не уверены или не знаете значения уровня холестерина в вашей крови. Рекомендованное значение уровня холестерина ниже 5 ммоль/л. Высокий уровень холестерина – большая вероятность возникновения сердечно-сосудистых заболеваний. Проводите измерения уровня минимум 1 раз в год. Знание медицинских показателей позволит Вам поддерживать свое здоровье на высоком уровне.");
      }
      if(this.checkQuestionAnswer('18', '1', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что уровень липопротеинов низкой плотности (ЛПНП, «плохой» холестерин) находится в зоне ниже 3.5 ммоль/л, что соответствует норме. Высокий уровень ЛПНП – высокий риск возникновения атеросклероза и как следствие сердечно-сосудистых заболеваний.");
      }
      if(this.checkQuestionAnswer('18', '2', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что уровень липопротеинов низкой плотности (ЛПНП, «плохой» холестерин) находится в зоне от 3.5 до 4 ммоль/л, что соответствует пограничной зоне. Рекомендованное значение уровня холестерина ниже 3.5 ммоль/л. Высокий уровень ЛПНП – высокий риск возникновения атеросклероза и как следствие сердечно-сосудистых заболеваний.");
      }
      if(this.checkQuestionAnswer('18', '3', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что уровень липопротеинов низкой плотности (ЛПНП, «плохой» холестерин) находится выше 4 ммоль/л, что говорит о высоких показателях. Рекомендованное значение уровня холестерина ниже 3.5 ммоль/л. Обратитесь к лечащему врачу за консультацией. Высокий уровень ЛПНП – риск возникновения атеросклероза и как следствие сердечно-сосудистых заболеваний.");
      }
      if(this.checkQuestionAnswer('18', '4', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что не уверены или не знаете значения уровня липопротеинов низкой плотности (ЛПНП, «плохой» холестерин) в вашей крови. Рекомендованное значение уровня ЛПНП ниже 3.5 ммоль/л. Высокий уровень ЛПНП – большая вероятность возникновения атеросклероза и как следствие сердечно-сосудистых заболеваний. Проводите измерения уровня ЛПНП  минимум 1 раз в год. Знание медицинских показателей позволит Вам поддерживать свое здоровье на высоком уровне.");
      }
      if(this.checkQuestionAnswer('19', '1', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что уровень липопротеинов высокой плотности (ЛПВП, «хороший» холестерин) находится в зоне  более 1.5 ммоль/л, что соответствует норме. Низкий уровень ЛПВП – высокий риск возникновения атеросклероза и как следствие сердечно-сосудистых заболеваний.");
      }
      if(this.checkQuestionAnswer('19', '2', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что уровень липопротеинов высокой плотности (ЛПВП, «хороший» холестерин)  находится в зоне от 1 до 1.5 ммоль/л, что соответствует пограничной зоне. Рекомендованное значение уровня холестерина выше 1.5 ммоль/л. Низкий уровень ЛПВП – высокий риск возникновения атеросклероза и как следствие сердечно-сосудистых заболеваний.");
      }
      if(this.checkQuestionAnswer('19', '3', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что уровень липопротеинов высокой плотности (ЛПВП, «хороший» холестерин)  менее 1 ммоль/л, что соответствует пониженным показателям. Рекомендованное значение уровня холестерина выше 1.5 ммоль/л. Низкий уровень ЛПВП – высокий риск возникновения атеросклероза и как следствие сердечно-сосудистых заболеваний.");
      }
      if(this.checkQuestionAnswer('19', '4', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что не уверены или не знаете значения уровня липопротеинов высокой плотности (ЛПВП, «хороший» холестерин). Рекомендованное значение уровня холестерина выше 1.5 ммоль/л. Низкий уровень ЛПВП – высокий риск возникновения атеросклероза и как следствие сердечно-сосудистых заболеваний. Проводите измерения уровня ЛПВП  минимум 1 раз в год. Знание медицинских показателей позволит Вам поддерживать свое здоровье на высоком уровне.");
      }
      if(this.checkQuestionAnswer('21', '1', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что уровень глюкозы в крови менее 5.5 ммоль/л, что соответствует желательным показателям. Высокий уровень глюкозы натощак  – маркер наличия сахарного диабета.");
      }
      if(this.checkQuestionAnswer('21', '2', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что уровень глюкозы в крови от 5.5 до 6.7 ммоль/л, что соответствует пограничной зоне. Вам необходимо проконсультироваться с лечащим врачом. Высокий уровень глюкозы натощак  – маркер наличия сахарного диабета.");
      }
      if(this.checkQuestionAnswer('21', '3', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что уровень глюкозы в крови от 6.7 ммоль/л, что соответствует повышенным показателям. Вам необходимо проконсультироваться с лечащим врачом. Высокий уровень глюкозы натощак  – маркер наличия сахарного диабета.");
      }
      if(this.checkQuestionAnswer('21', '4', 'equal')) {
        this.reportTest.section3.healthScreening.push("Вы указали, что не уверены или не знаете значения уровня глюкозы в капиллярной крови натощак. Высокий уровень глюкозы натощак  – маркер наличия сахарного диабета. Проводите измерения уровня глюкозы в капиллярной крови натощак  минимум 1 раз в год. Знание медицинских показателей позволит Вам поддерживать свое здоровье на высоком уровне. Обязательно исследуйте глюкозу в капиллярной крови натощак, если вы длительное время (более 2 недель) испытываете жажду и частое мочеиспускание (учитывайте время года).");
      }
      //
      if(this.checkQuestionAnswer('29', '1:1', 'equal')) {
        this.reportTest.section3.medicalCheckups.push("Осмотр терапевта. Вы указали, что проходили осмотр в течение 1 года, что соответствует норме. Рекомендовано проходить осмотр у терапевта 1 раз в год для выявления факторов риска здоровью и заболеваний на ранней стадии.");
      }
      if(this.checkQuestionAnswer('29', '1:2', 'equal')) {
        this.reportTest.section3.medicalCheckups.push("Осмотр терапевта. Вы указали, что проходили осмотр 2-3 года назад. Рекомендовано проходить осмотр у терапевта 1 раз в год для выявления факторов риска здоровью и заболеваний на ранней стадии.");
      }
      if(this.checkQuestionAnswer('29', '1:3', 'equal')) {
        this.reportTest.section3.medicalCheckups.push("Осмотр терапевта. Вы указали, что проходили осмотр более 4 лет назад. Рекомендовано проходить осмотр у терапевта 1 раз в год для выявления факторов риска здоровью и заболеваний на ранней стадии.");
      }
      if(this.checkQuestionAnswer('29', '1:4', 'equal')) {
        this.reportTest.section3.medicalCheckups.push("Осмотр терапевта. Вы указали, что никогда не проходили или не знаете когда проходили осмотр. Рекомендовано проходить осмотр у терапевта 1 раз в год для выявления факторов риска здоровью и заболеваний на ранней стадии.");
      }
      if(this.sex === 2 && this.age > 40) {
        if(this.checkQuestionAnswer('29', '4:1', 'equal')) {
          this.reportTest.section3.medicalCheckups.push("Маммография. Вы указали, что проходили маммографию в течение 1 года, что соответствует норме. Рекомендовано проходить маммографию 1 раз в год после достижения женщиной 40 лет. Рак молочной железы – самое частое онкологическое заболевание у женщин. Раннее выявление рака молочной железы позволит вылечить данное заболевание.");
        }
        if(this.checkQuestionAnswer('29', '4:2', 'equal')) {
          this.reportTest.section3.medicalCheckups.push("Маммография. Вы указали, что проходили маммографию в 2-3 года назад, что не соответствует норме. Рекомендовано проходить маммографию 1 раз в год после достижения женщиной 40 лет. Рак молочной железы – самое частое онкологическое заболевание у женщин. Раннее выявление рака молочной железы позволит вылечить данное заболевание.");
        }
        if(this.checkQuestionAnswer('29', '4:3', 'equal')) {
          this.reportTest.section3.medicalCheckups.push("Маммография. Вы указали, что проходили маммографию более 4 лет назад, что не соответствует норме. Рекомендовано проходить маммографию 1 раз в год после достижения женщиной 40 лет. Рак молочной железы – самое частое онкологическое заболевание у женщин. Раннее выявление рака молочной железы позволит вылечить данное заболевание.");
        }
        if(this.checkQuestionAnswer('29', '4:4', 'equal')) {
          this.reportTest.section3.medicalCheckups.push("Маммография. Вы указали, что никогда не проходили или не знаете когда проходили маммографию. Рекомендовано проходить маммографию 1 раз в год после достижения женщиной 40 лет. Рак молочной железы – самое частое онкологическое заболевание у женщин. Раннее выявление рака молочной железы позволит вылечить данное заболевание.");
        }
      }
      if(this.sex === 1 && this.age > 40) {
        if(this.checkQuestionAnswer('29', '5:1', 'equal')) {
          this.reportTest.section3.medicalCheckups.push("Тест ПСА. Вы указали, что проходили тест ПСА в течение 1 года, что соответствует норме. Рекомендовано проходить тест ПСА 1 раз в год после достижения мужчиной возраста 40 лет. Рак предстательной железы – распространённое мужское онкологическое заболевание. Раннее выявление рака предстательной железы позволяет вылечить данное заболевание.");
        }
        if(this.checkQuestionAnswer('29', '5:2', 'equal')) {
          this.reportTest.section3.medicalCheckups.push("Тест ПСА. Вы указали, что проходили тест ПСА в течение 2-3 лет, что не соответствует норме. Рекомендовано проходить тест ПСА 1 раз в год после достижения мужчиной возраста 40 лет. Рак предстательной железы – распространённое мужское онкологическое заболевание. Раннее выявление рака предстательной железы позволяет вылечить данное заболевание.");
        }
        if(this.checkQuestionAnswer('29', '5:3', 'equal')) {
          this.reportTest.section3.medicalCheckups.push("Тест ПСА. Вы указали, что проходили тест ПСА более 4 лет назад, что не соответствует норме. Рекомендовано проходить тест ПСА 1 раз в год после достижения мужчиной возраста 40 лет. Рак предстательной железы – распространённое мужское онкологическое заболевание. Раннее выявление рака предстательной железы позволяет вылечить данное заболевание.");
        }
        if(this.checkQuestionAnswer('29', '5:4', 'equal')) {
          this.reportTest.section3.medicalCheckups.push("Тест ПСА. Вы указали, никогда не проходили или не знаете когда проходили тест ПСА. Рекомендовано проходить тест ПСА 1 раз в год после достижения мужчиной возраста 40 лет. Рак предстательной железы – распространённое мужское онкологическое заболевание. Раннее выявление рака предстательной железы позволяет вылечить данное заболевание.");
        }
      }
      if(this.checkQuestionAnswer('29', '6:1', 'equal')) {
        this.reportTest.section3.medicalCheckups.push("Флюорография. Вы указали, что проходили флюорографию в течение 1 года, что соответствует норме. Рекомендовано проходить флюорографию 1 раз в год. Данное исследование позволяет выявить рак легких. Раннее выявление опухолей легких позволяет достичь лучших результатов в лечении.");
      }
      if(this.checkQuestionAnswer('29', '6:2', 'equal')) {
        this.reportTest.section3.medicalCheckups.push("Флюорография. Вы указали, что проходили флюорографию в течение 2-3 лет, что не соответствует норме. Рекомендовано проходить флюорографию 1 раз в год. Данное исследование позволяет выявить рак легких. Раннее выявление опухолей легких позволяет достичь лучших результатов в лечении.");
      }
      if(this.checkQuestionAnswer('29', '6:3', 'equal')) {
        this.reportTest.section3.medicalCheckups.push("Флюорография. Вы указали, что проходили флюорографию более 4 лет назад, что не соответствует норме. Рекомендовано проходить флюорографию 1 раз в год. Данное исследование позволяет выявить рак легких. Раннее выявление опухолей легких позволяет достичь лучших результатов в лечении. ");
      }
      if(this.checkQuestionAnswer('29', '6:4', 'equal')) {
        this.reportTest.section3.medicalCheckups.push("Флюорография. Вы указали, что никогда не проходили или не знаете когда проходили флюорографию. Рекомендовано проходить флюорографию 1 раз в год. Данное исследование позволяет выявить рак легких. Раннее выявление опухолей легких позволяет достичь лучших результатов в лечении.");
      }
      //
      if(this.checkQuestionAnswer('29', '3:1', 'equal')) {
        this.reportTest.section3.toothHealth.push("Осмотр стоматолога. Вы указали, что Вы проходили осмотр стоматолога в течение 12 месяцев – как рекомендовано Минздравом РФ. Хорошая гигиена рта – залог общего здоровья. Имеются данные, что заболевания полости рта могут приводить к сердечно-сосудистым заболеваниям и другим серьезным нарушениям здоровья.");
      }
      if(this.checkQuestionAnswer('29', '3:2', 'equal')) {
        this.reportTest.section3.toothHealth.push("Осмотр стоматолога. Вы указали, что Вы проходили осмотр стоматолога в течение 2-3 лет. Минздравом РФ рекомендовано ежегодно проходить осмотр у стоматолога. Хорошая гигиена рта – залог общего здоровья. Имеются данные, что заболевания полости рта могут приводить к сердечно-сосудистым заболеваниям и другим серьезным нарушениям здоровья.");
      }
      if(this.checkQuestionAnswer('29', '3:3', 'equal')) {
        this.reportTest.section3.toothHealth.push("Осмотр стоматолога. Вы указали, что Вы проходили осмотр стоматолога более 4 лет. Минздравом РФ рекомендовано ежегодно проходить осмотр у стоматолога. Хорошая гигиена рта – залог общего здоровья. Имеются данные, что заболевания полости рта могут приводить к сердечно-сосудистым заболеваниям и другим серьезным нарушениям здоровья.");
      }
      if(this.checkQuestionAnswer('29', '3:4', 'equal')) {
        this.reportTest.section3.toothHealth.push("Осмотр стоматолога. Вы указали, что Вы не помните или никогда не проходили осмотр у стоматолога. Минздравом РФ рекомендовано ежегодно проходить осмотр у стоматолога. Хорошая гигиена рта – залог общего здоровья. Имеются данные, что заболевания полости рта могут приводить к сердечно-сосудистым заболеваниям и другим серьезным нарушениям здоровья.");
      }
      if(this.checkQuestionAnswer('30', '1', 'equal')) {
        this.reportTest.section3.toothHealth.push("Вы указали, что при чистке зубов Ваши десна не кровоточат, что говорит о том, что, скорее всего, Ваши десна здоровы. Помните, что ежедневно необходимо чистить зубы не только щеткой, но и зубной нитью.");
      }
      if(this.checkQuestionAnswer('30', '2', 'equal')) {
        this.reportTest.section3.toothHealth.push("Вы указали, что при чистке зубов Ваши десна кровоточат, что говорит о высоком риске стоматологических заболеваний. Обратитесь в ближайшее время к стоматологу, чтобы получить рекомендации по профилактике заболеваний полости рта. Помните, что ежедневно необходимо чистить зубы не только щеткой, но и зубной нитью.");
      }
      if(this.checkQuestionAnswer('23', '1', 'equal')) {
        this.reportTest.section3.medicalCheckups.push("Вы указали, что оцениваете уровень своего здоровья на отлично! Последние исследования показали, что Ваша личная оценка соответствует реальному положению вещей на 85-90%.  Будьте оптимистичны и придерживайтесь рекомендаций по питанию, физической активности и профилактике стресса и ваше здоровье всегда будет на высоком уровне! Регулярно проходите медицинское обследование, и Вам не будут грозить никакие заболевания, т.к. Вы всегда сможете использовать профилактические меры.");
      }
      if(this.checkQuestionAnswer('23', '2', 'equal')) {
        this.reportTest.section3.medicalCheckups.push("Вы указали, что оцениваете уровень своего здоровья очень хорошо! Последние исследования показали, что Ваша личная оценка соответствует реальному положению вещей на 85-90%.  Будьте оптимистичны и придерживайтесь рекомендаций по питанию, физической активности и профилактике стресса и ваше здоровье всегда будет на высоком уровне! Регулярно проходите медицинское обследование, и Вам не будут грозить никакие заболевания, т.к. Вы всегда сможете использовать профилактические меры.");
      }
      if(this.checkQuestionAnswer('23', '3', 'equal')) {
        this.reportTest.section3.medicalCheckups.push("Вы указали, что оцениваете уровень своего здоровья хорошо! Последние исследования показали, что Ваша личная оценка соответствует реальному положению вещей на 85-90%.  Будьте оптимистичны и придерживайтесь рекомендаций по питанию, физической активности и профилактике стресса и ваше здоровье всегда будет на высоком уровне! Регулярно проходите медицинское обследование, и Вам не будут грозить никакие заболевания, т.к. Вы всегда сможете использовать профилактические меры.");
      }
      if(this.checkQuestionAnswer('23', '4', 'equal')) {
        this.reportTest.section3.medicalCheckups.push("Вы указали, что оцениваете уровень своего здоровья удовлетворительно! Последние исследования показали, что Ваша личная оценка соответствует реальному положению вещей на 85-90%.  Будьте оптимистичны и придерживайтесь рекомендаций по питанию, физической активности и профилактике стресса и ваше здоровье всегда будет на высоком уровне! Но если что-то Вас беспокоит – обязательно проходите профилактические осмотры.");
      }
      if(this.checkQuestionAnswer('23', '5', 'equal')) {
        this.reportTest.section3.medicalCheckups.push("Вы указали, что оцениваете уровень своего здоровья плохо. Последние исследования показали, что Ваша личная оценка соответствует реальному положению вещей на 85-90%.  Будьте оптимистичны и придерживайтесь рекомендаций по питанию, физической активности и профилактике стресса и ваше здоровье всегда будет на высоком уровне! Но если что-то Вас беспокоит – обязательно проходите профилактические осмотры.");
      }
      //
      if(this.massIndex < 18.5) {
        this.reportTest.section3.lifeStyle.push("Вес. На основе данных роста и веса рассчитывается индекс массы тела (ИМТ), индикатор избыточной массы тела и ожирения. На основании данных Ваш ИМТ менее 18.5, при рекомендованных значениях от 18.5 до 24.9, что говорит о том, что Вы имеете недостаточную массу тела. Недостаточная масса тела может приводит к повышенной утомляемость, низкому иммунитету (что может приводить к частым простудным заболеваниям), низкой эффективности, склонности к психологическим нарушениям, депрессии, преждевременному старению.");
      } else
      if(this.massIndex >= 18.5 && this.massIndex < 24.9) {
        this.reportTest.section3.lifeStyle.push("Вес. На основе данных роста и веса рассчитывается индекс массы тела (ИМТ), индикатор избыточной массы тела и ожирения. На основании данных Ваш ИМТ в зоне от 18.5 до 24.9, что соответствует норме. Поддерживайте массу в текущих значениях и Ваше здоровье будет в отличном состоянии! Избыточная масса может приводить к большому количеству заболеваний, таких как: сердечно-сосудистые заболевания, инсульт, диабет, рак толстой кишки, рак груди, рак простаты, заболевания опорно-двигательного аппарата.");
      } else
      if(this.massIndex >= 24.9 && this.massIndex < 29.9) {
        this.reportTest.section3.lifeStyle.push("Вес. На основе данных роста и веса рассчитывается индекс массы тела (ИМТ), индикатор избыточной массы тела и ожирения. На основании данных Ваш ИМТ в зоне от 24.9 до 29.9, при рекомендованных значениях от 18.5 до 24.9, что говорит о том, что Вы имеете избыточную массу тела. Избыточная масса может приводить к большому количеству заболеваний, таких как: сердечно-сосудистые заболевания, инсульт, диабет, рак толстой кишки, рак груди, рак простаты, заболевания опорно-двигательного аппарата.");
      } else
      if(this.massIndex >= 29.9 && this.massIndex < 34.9) {
        this.reportTest.section3.lifeStyle.push("Вес. На основе данных роста и веса рассчитывается индекс массы тела (ИМТ), индикатор избыточной массы тела и ожирения. На основании данных Ваш ИМТ в зоне от 29.9 до 34.9, при рекомендованных значениях от 18.5 до 24.9, что говорит о том, что Вы имеете ожирение 1 степени. Избыточная масса может приводить к большому количеству заболеваний, таких как: сердечно-сосудистые заболевания, инсульт, диабет, рак толстой кишки, рак груди, рак простаты, заболевания опорно-двигательного аппарата. Обратитесь к специалисту, чтобы скорректировать Ваш рацион питания и уменьшить массу тела.");
      } else
      if(this.massIndex >= 34.9 && this.massIndex < 39.9) {
        this.reportTest.section3.lifeStyle.push("Вес. На основе данных роста и веса рассчитывается индекс массы тела (ИМТ), индикатор избыточной массы тела и ожирения. На основании данных Ваш ИМТ в зоне от 34.9 до 39.9, при рекомендованных значениях от 18.5 до 24.9, что говорит о том, что Вы имеете ожирение 2 степени. Избыточная масса может приводить к большому количеству заболеваний, таких как: сердечно-сосудистые заболевания, инсульт, диабет, рак толстой кишки, рак груди, рак простаты, заболевания опорно-двигательного аппарата. Обратитесь к специалисту, чтобы скорректировать Ваш рацион питания и уменьшить массу тела.");
      } else
      if(this.massIndex >= 39.9) {
        this.reportTest.section3.lifeStyle.push("Вес. На основе данных роста и веса рассчитывается индекс массы тела (ИМТ), индикатор избыточной массы тела и ожирения. На основании данных Ваш ИМТ более 40, при рекомендованных значениях от 18.5 до 24.9, что говорит о том, что Вы имеете ожирение 3 степени. Избыточная масса может приводить к большому количеству заболеваний, таких как: сердечно-сосудистые заболевания, инсульт, диабет, рак толстой кишки, рак груди, рак простаты, заболевания опорно-двигательного аппарата. Обратитесь к специалисту, чтобы скорректировать Ваш рацион питания и уменьшить массу тела.");
      }
      if(this.checkQuestionAnswer('44', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Физическая активность. Вы отметили, что занимаетесь реже чем 1 раз в неделю продолжительностью более 20 минут (учитываются только те упражнения, которые делают ваше дыхание и сердцебиение учащенным, вы потеете), что является недостаточным для поддержания хорошего уровня здоровья. Для профилактики заболеваний и поддержания отличного состояния здоровья, специалисты рекомендуют заниматься минимум 3-4 раза в неделю по 30-40 минут. Данные тренировки должны включать в себя силовые упражнения, упражнения на растяжку, кардиотренировки (бег, скандинавская ходьба и др.).");
      }
      if(this.checkQuestionAnswer('44', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Физическая активность. Вы отметили, что занимаетесь 1 или 2 раза в неделю продолжительностью более 20 минут (учитываются только те упражнения, которые делают ваше дыхание и сердцебиение учащенным, вы потеете), что является недостаточным для поддержания хорошего уровня здоровья. Для профилактики заболеваний и поддержания отличного состояния здоровья, специалисты рекомендуют заниматься минимум 3-4 раза в неделю по 30-40 минут. Данные тренировки должны включать в себя силовые упражнения, упражнения на растяжку, кардиотренировки (бег, скандинавская ходьба и др.).");
      }
      if(this.checkQuestionAnswer('44', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Физическая активность. Вы отметили, что занимаетесь 3 или 4 раза в неделю продолжительностью более 20 минут (учитываются только те упражнения, которые делают ваше дыхание и сердцебиение учащенным, вы потеете), что является достаточным для поддержания хорошего уровня здоровья. Для профилактики заболеваний и поддержания отличного состояния здоровья, специалисты рекомендуют заниматься минимум 3-4 раза в неделю по 30-40 минут. Данные тренировки должны включать в себя силовые упражнения, упражнения на растяжку, кардиотренировки (бег, скандинавская ходьба и др.).");
      }
      if(this.checkQuestionAnswer('44', '4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Физическая активность. Вы отметили, что занимаетесь 4 и более раза в неделю продолжительностью более 20 минут (учитываются только те упражнения, которые делают ваше дыхание и сердцебиение учащенным, вы потеете), что является достаточным для поддержания хорошего уровня здоровья. Вы молодец, т.к. даете отличную нагрузку организму для профилактики старения и основных видов заболеваний. Помните, что для максимального эффекта нужно включать в тренировку различные упражнения, такие как: силовые упражнения, упражнения на растяжку, кардиотренировки (бег, скандинавская ходьба и др.).");
      }
      if(this.checkQuestionAnswer('47', '1:1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Силовые упражнения. Вы указали, что в течение недели не выполняете силовые упражнения. Специалисты рекомендуют выполнять упражнения на силу минимум 1-2 раза в неделю. К сожалению, у некоторых упражнений имеются противопоказания, поэтому перед началом активных тренировок, лучше обратиться специалисту.");
      }
      if(this.checkQuestionAnswer('47', '1:2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Силовые упражнения. Вы указали, что в течение недели выполняете силовые упражнения 1-2 раза, что соответствует норме. Продолжайте в том же духе! Но не забывайте про другие типы упражнений.");
      }
      if(this.checkQuestionAnswer('47', '1:3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Силовые упражнения. Вы указали, что в течение недели выполняете силовые упражнения 3-4 раза, что соответствует норме. Продолжайте в том же духе! Но не забывайте про другие типы упражнений.");
      }
      if(this.checkQuestionAnswer('47', '1:4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Силовые упражнения. Вы указали, что в течение недели выполняете силовые упражнения 5-6 раза, что соответствует норме. Продолжайте в том же духе! Обязательно комбинируйте силовую нагрузку с упражнениями на растяжку и кардиоупражнениями.");
      }
      if(this.checkQuestionAnswer('47', '2:1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Упражнения на растяжку. Вы указали, что в течение недели не выполняете упражнения на растяжку. Специалисты рекомендуют выполнять упражнения на растяжку минимум 1-2 раза в неделю. К сожалению, у некоторых упражнений имеются противопоказания, поэтому перед началом активных тренировок, лучше обратиться специалисту.");
      }
      if(this.checkQuestionAnswer('47', '2:2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Упражнения на растяжку. Вы указали, что в течение недели выполняете упражнения на растяжку 1-2 раза, что соответствует норме. Продолжайте в том же духе! Но не забывайте про другие типы упражнений.");
      }
      if(this.checkQuestionAnswer('47', '2:3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Упражнения на растяжку. Вы указали, что в течение недели выполняете упражнения на растяжку 3-4 раза, что соответствует норме. Продолжайте в том же духе! Но не забывайте про другие типы упражнений.");
      }
      if(this.checkQuestionAnswer('47', '2:4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Упражнения на растяжку. Вы указали, что в течение недели выполняете упражнения на растяжку 5-6 раза, что соответствует норме. Продолжайте в том же духе! Обязательно комбинируйте силовую нагрузку с силовыми упражнениями и кардиоупражнениями.");
      }
      if(this.checkQuestionAnswer('47', '3:1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Кардиоупражнения. Вы указали, что в течение недели не выполняете кардиоупражнения (бег, скандинавская ходьба и др.). Специалисты рекомендуют выполнять кардиоупражнения минимум 1-2 раза в неделю. К сожалению, у некоторых упражнений имеются противопоказания, поэтому перед началом активных тренировок, лучше обратиться специалисту.");
      }
      if(this.checkQuestionAnswer('47', '3:2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Кардиоупражнения. Вы указали, что в течение недели выполняете кардиоупражнения 1-2 раза, что соответствует норме. Продолжайте в том же духе! Но не забывайте про другие типы упражнений.");
      }
      if(this.checkQuestionAnswer('47', '3:3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Кардиоупражнения. Вы указали, что в течение недели выполняете кардиоупражнения 3-4 раза, что соответствует норме. Продолжайте в том же духе! Но не забывайте про другие типы упражнений.");
      }
      if(this.checkQuestionAnswer('47', '3:4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Кардиоупражнения. Вы указали, что в течение недели выполняете кардиоупражнения 5-6 раза, что соответствует норме. Продолжайте в том же духе! Обязательно комбинируйте силовую нагрузку с упражнениями на растяжку и кардиоупражнениями. Если вы любите часто заниматься беговыми упражнениями приобретайте качественную обувь для профилактики травм и нарушений опорно-двигательного аппарата.");
      }
      if(this.checkQuestionAnswer('45', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Вы указали, что ежедневно ходите менее 20 минут, что не соответствует норме. Последние исследования показали, что наибольшее значение для здоровья имеет фоновая физическая активность, одной из основных разновидностей которой является ходьба. Проходя  каждый день 10 000 шагов, Вы сможете укрепить Ваше здоровье.");
      }
      if(this.checkQuestionAnswer('45', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Вы указали, что ежедневно ходите от 20 до 40 минут, что находится в пограничной зоне. Постарайтесь увеличить время ходьбы в течение дня. Последние исследования показали, что наибольшее значение для здоровья имеет фоновая физическая активность, одной из основных разновидностей которой является ходьба. Проходя  каждый день 10 000 шагов, Вы сможете укрепить Ваше здоровье.");
      }
      if(this.checkQuestionAnswer('45', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Вы указали, что ежедневно ходите от 40 до 60 минут, что  соответствует норме. Продолжайте ходить так же много! Последние исследования показали, что наибольшее значение для здоровья имеет фоновая физическая активность, одной из основных разновидностей которой является ходьба. Проходя  каждый день 10 000 шагов, Вы сможете укрепить Ваше здоровье.");
      }
      if(this.checkQuestionAnswer('45', '4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Вы указали, что ежедневно ходите более 60 минут, что  соответствует норме. Продолжайте ходить так же много! Последние исследования показали, что наибольшее значение для здоровья имеет фоновая физическая активность, одной из основных разновидностей которой является ходьба. Проходя  каждый день 10 000 шагов, Вы сможете укрепить Ваше здоровье.");
      }
      if(this.checkQuestionAnswer('46', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Вы указали, что в течение дня проводите в сидячем положение 1-2 часа. Малоподвижный образ жизни и сидение без движения более 2 часов в день является фактором риска таких заболеваний как сахарный диабет 2 типа.");
      }
      if(this.checkQuestionAnswer('46', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Вы указали, что в течение дня проводите в сидячем положение 2-4 часа. Если Вам приходится длительно сидеть, обязательно вставайте каждые 1.5- 2 часа и делайте комплекс производственных упражнений или ходите 5-10 минут. Малоподвижный образ жизни и сидение без движения более 2 часов в день является фактором риска таких заболеваний как сахарный диабет 2 типа.");
      }
      if(this.checkQuestionAnswer('46', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Вы указали, что в течение дня проводите в сидячем положение 4-6 часа. Если Вам приходится длительно сидеть, обязательно вставайте каждые 1.5- 2 часа и делайте комплекс производственных упражнений или ходите 5-10 минут. Малоподвижный образ жизни и сидение без движения более 2 часов в день является фактором риска таких заболеваний как сахарный диабет 2 типа.");
      }
      if(this.checkQuestionAnswer('46', '4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Вы указали, что в течение дня проводите в сидячем положение более 6 часа. Если Вам приходится длительно сидеть, обязательно вставайте каждые 1.5- 2 часа и делайте комплекс производственных упражнений или ходите 5-10 минут. Малоподвижный образ жизни и сидение без движения более 2 часов в день является фактором риска таких заболеваний как сахарный диабет 2 типа.");
      }
      if(this.checkQuestionAnswer('34', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Курение. Вы указали, что в течение прошедших 30 дней в помещении где Вы находились кто-то курил. Как показывают исследования, пассивное курение может принести еще больший вред, чем курение. Пассивное курение может быть причиной нарушения здоровья (сердечно-сосудистые заболевания, онкология, нарушения репродуктивной системы и др.). Не находитесь в задымленных помещениях, это позволит понизить риск некоторых заболеваний.");
      }
      if(this.checkQuestionAnswer('34', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Курение. Вы указали, что в течение прошедших 30 дней в помещении где Вы находились никто не курил. Как показывают исследования, пассивное курение может принести еще больший вред, чем курение. Пассивное курение может быть причиной нарушения здоровья (сердечно-сосудистые заболевания, онкология, нарушения репродуктивной системы и др.). Не находитесь в задымленных помещениях, это позволит понизить риск некоторых заболеваний.");
      }
      if(this.checkQuestionAnswer('34', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Курение. Вы указали, что не знаете находились ли Вы в помещениях, где кто-то курил в течение прошедших 30 дней. Как показывают исследования, пассивное курение может принести еще больший вред, чем курение. Пассивное курение может быть причиной нарушения здоровья (сердечно-сосудистые заболевания, онкология, нарушения репродуктивной системы и др.). Не находитесь в задымленных помещениях, это позволит понизить риск некоторых заболеваний.");
      }
      if(this.checkQuestionAnswer('31', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Курение. Вы указали, что курите сигареты,  тем самым Вы значительно увеличиваете риски сердечно-сосудистых  заболеваний, рака и других заболеваний. Если Вы решите отказаться от курения, обратитесь к специалисту, это повысит Ваши шансы на успех. Помните, что уже через 24 часа после отказа от курения, Ваш организм начнет функционировать нормально.");
      }
      if(this.checkQuestionAnswer('31', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Курение. Вы указали, что курите самокрутки,  тем самым Вы значительно увеличиваете риски сердечно-сосудистых  заболеваний, рака и других заболеваний. Если Вы решите отказаться от курения, обратитесь к специалисту, это повысит Ваши шансы на успех. Помните, что уже через 24 часа после отказа от курения, Ваш организм начнет функционировать нормально.");
      }
      if(this.checkQuestionAnswer('31', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Курение. Вы указали, что вы курите сигары,  тем самым Вы значительно увеличиваете риски сердечно-сосудистых  заболеваний, рака и других заболеваний. Если Вы решите отказаться от курения, обратитесь к специалисту, это повысит Ваши шансы на успех. Помните, что уже через 24 часа после отказа от курения, Ваш организм начнет функционировать нормально.");
      }
      if(this.checkQuestionAnswer('31', '4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Курение. Вы указали, что папиросы,  тем самым Вы значительно увеличиваете риски сердечно-сосудистых  заболеваний, рака и других заболеваний. Если Вы решите отказаться от курения, обратитесь к специалисту, это повысит Ваши шансы на успех. Помните, что уже через 24часа после отказа от курения, Ваш организм начнет функционировать нормально.");
      }
      if(this.checkQuestionAnswer('31', '5', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Курение. Вы указали, что курите кальян,  тем самым Вы значительно увеличиваете риски сердечно-сосудистых  заболеваний, рака и других заболеваний. Если Вы решите отказаться от курения, обратитесь к специалисту, это повысит Ваши шансы на успех. Помните, что уже через 24часа после отказа от курения, Ваш организм начнет функционировать нормально.");
      }
      if(this.checkQuestionAnswer('31', '6', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Курение. Вы указали, что употребляете вейпы (электронные сигареты),  тем самым Вы значительно увеличиваете риски сердечно-сосудистых  заболеваний, рака и других заболеваний. Если Вы решите отказаться от курения, обратитесь к специалисту, это повысит Ваши шансы на успех. Помните, что уже через 24часа после отказа от курения, Ваш организм начнет функционировать нормально.");
      }
      if(this.checkQuestionAnswer('31', '7', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Курение. Вы указали, что употребляете продукту на основе табака,  тем самым Вы значительно увеличиваете риски сердечно-сосудистых  заболеваний, рака и других заболеваний. Если Вы решите отказаться от курения, обратитесь к специалисту, это повысит Ваши шансы на успех. Помните, что уже через 24часа после отказа от курения, Ваш организм начнет функционировать нормально.");
      }
      if(this.checkQuestionAnswer('31', '8', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Вы указали, что бросили курить. Если Вы продолжите в том же духе, то достигнете успехов в укреплении здоровья. Но помните, Вашему организму птребуется много времени для восстановления:\n- Через 24 ч. Тело начнет функционировать в нормальном режиме.\n- Через 72 часа. Ваши легкие очистятся и улучшить качество Вашегггооо газообмена.\n- Через 2-3 недели. Жизненная емкость легких начнет увеличиваться.\n- В течение от 1 до 9 месяцев. Здоровье улучшиться, риск возникновения простудных и инфекционных заболеваний значительно снизится.\n- Спустя 1 год. Риск возникновения сердечно-сосудистых заболеваний уменьшится в 2 раза. \n- Через 2 года. Риск сердечно приступа снизится до нормальных показателей.\n- Через 5 лет. Риск  заболеть онкологией, раком ротовой полости, горла, пищевода уменьшится в 2 раза, по сравнению с курильщиком.\n- Через 10 лет. Вероятность смерти от рака легких достигнет уровня некурящего человека.\n- Через 15 лет. Риск сердечно-сосудистых заболеваний достигнет уровня некурящего человека.Помните, что 1 год отказа от курения наиболее сложен. Прибегайте к помощи специалистов, если у Вас появляется тяга к возобновлению вредной привычки.");
      }
      if(this.objResult['32'] && typeof(parseInt(this.objResult['32'][0])) === 'number' && this.objResult['33'] && typeof(parseInt(this.objResult['33'][0])) === 'number') {
        if(parseInt(this.objResult['32'][0])*parseInt(this.objResult['33'][0]) / 20 < 10) {
          this.reportTest.section3.lifeStyle.push("На основе Вашего ответа с использованием  методики, разработанной шведским врачом К. Фагерстремом, мы определили индекс курящего человека (ИК).  ИК меньше 10, что говорит о среднем риске развития сердечно-сосудистой патологии и других заболеваний.");
        }
        if(parseInt(this.objResult['32'][0])*parseInt(this.objResult['33'][0]) / 20 >= 10) {
          this.reportTest.section3.lifeStyle.push("На основе Вашего ответа с использованием  методики, разработанной шведским врачом К. Фагерстремом, мы определили индекс курящего человека (ИК).  ИК больше 10, что говорит о высоком риске развития сердечно-сосудистой патологии,  хронической обструктивной болезни легких и др. заболеваний.");
        }
      }
      if(this.objResult['35'] && typeof(parseInt(this.objResult['35'][0])) === 'number') {
        this.reportTest.section3.lifeStyle.push("Вы указали, что употребляете " + this.objResult['35'][0] + " напитков в неделю.");
      }
      if(this.checkQuestionAnswer('36', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Также Вы указали, что никогда не пьете более 5 напитков за прием. Максимальная доза употребления алкоголя в день равна 50 г. (для женщин 40 г.), а  в неделю 196 г. Превышение уровня умеренного потребления алкоголя может повышать риск возникновения несчастных случаев, высокого артериального давления, инсульта, насилия, самоубийств, врождённых пороков и определенных видов рака");
      }
      if(this.checkQuestionAnswer('36', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Также Вы указали, что 1 раз в неделю более 5 напитков за прием за прием, что превышает норму и повышает риск заболеваний. Максимальная доза употребления алкоголя в день равна 50 г. (для женщин 40 г.), а  в неделю 196 г. Превышение уровня умеренного потребления алкоголя может повышать риск возникновения несчастных случаев, высокого артериального давления, инсульта, насилия, самоубийств, врождённых пороков и определенных видов рака");
      }
      if(this.checkQuestionAnswer('36', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Также Вы указали, что 2-3 раза в неделю более 5 напитков за прием за прием, что превышает норму и повышает риск заболеваний. Максимальная доза употребления алкоголя в день равна 50 г. (для женщин 40 г.), а  в неделю 196 г. Превышение уровня умеренного потребления алкоголя может повышать риск возникновения несчастных случаев, высокого артериального давления, инсульта, насилия, самоубийств, врождённых пороков и определенных видов рака");
      }
      if(this.checkQuestionAnswer('36', '4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Также Вы указали, что 3-4 раза в неделю более 5 напитков за прием за прием, что превышает норму и повышает риск заболеваний. Максимальная доза употребления алкоголя в день равна 50 г. (для женщин 40 г.), а  в неделю 196 г. Превышение уровня умеренного потребления алкоголя может повышать риск возникновения несчастных случаев, высокого артериального давления, инсульта, насилия, самоубийств, врождённых пороков и определенных видов рака");
      }
      if(this.checkQuestionAnswer('39', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Жирная пища. В течение обычного дня, Вы употребляете 5-6 порций жирной и жаренной пищи, что превосходит норму. Жирная диета может способствовать возникновению таких заболеваний как диабет, сердечно-сосудистые заболевания и некоторые виды онкологических заболеваний. Больше 30% рациона не должно поступать с жирной пищей. Вы можете записывать в течение 1-2 недель то, что вы едите, и, на основе анализа, решить как уменьшить количество потребляемой жирной пищи.");
      }
      if(this.checkQuestionAnswer('39', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Жирная пища. В течение обычного дня, Вы употребляете 3-4 порций жирной и жаренной пищи, что достаточно много для организма. Жирная диета может способствовать возникновению таких заболеваний как диабет, сердечно-сосудистые заболевания и некоторые виды онкологических заболеваний. Больше 30% рациона не должно поступать с жирной пищей. Вы можете записывать в течение 1-2 недель то, что вы едите, и, на основе анализа, решить как уменьшить количество потребляемой жирной пищи.");
      }
      if(this.checkQuestionAnswer('39', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Жирная пища. В течение обычного дня, Вы употребляете 1-2 порции жирной и жаренной пищи, что соответствует норме. Жирная диета может способствовать возникновению таких заболеваний как диабет, сердечно-сосудистые заболевания и некоторые виды онкологических заболеваний. Всегда помните, что больше 30% рациона не должно поступать с жирной пищей.");
      }
      if(this.checkQuestionAnswer('39', '4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Жирная пища. В течение обычного дня, Вы  не употребляете жирной и жаренной пищи. Жирная диета может способствовать возникновению таких заболеваний как диабет, сердечно-сосудистые заболевания и некоторые виды онкологических заболеваний. Не забывайте употреблять растительные жиры ежедневно, т.к. это улучшит Ваши обменные процессы, иммунитет. Менее 30% рациона должно поступать с жирами (предпочтение стоит отдавать растительным жирам).");
      }
      if(this.checkQuestionAnswer('41', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Фаст-фуд.  Вы указали, что не употребляете продукты в ресторанах быстрого питания. Вы молодец! Данная пища содержит много трансжиров и животных жиров, что может плохо влиять на Ваше здоровье.");
      }
      if(this.checkQuestionAnswer('41', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Фаст-фуд.  Вы указали, что употребляете 1-2 раза продукты в ресторанах быстрого питания. Для контроля употребления количества жира и калорий, Вы должны ограничить количество посещения заведений фаст-фуда.");
      }
      if(this.checkQuestionAnswer('41', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Фаст-фуд.  Вы указали, что употребляете 3-4 раза продукты в ресторанах быстрого питания. Для контроля употребления количества жира и калорий, Вы должны ограничить количество посещения заведений фаст-фуда.");
      }
      if(this.checkQuestionAnswer('41', '4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Фаст-фуд.  Вы указали, что употребляете 5 и более раза продукты в ресторанах быстрого питания. Для контроля употребления количества жира и калорий, Вы должны ограничить количество посещения заведений фаст-фуда.");
      }
      if(this.checkQuestionAnswer('37', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Фрукты и овощи. Вы указали, что употребляете 5-6 порции фруктов или овощей каждый день. Фрукты и овощи отличный источник клетчатки. Для диеты на 2000 ккал - 4 порции фруктов и 4-5 порций овощей рекомендованы к ежедневному употреблению. Вы можете стараться увеличить количество потребляемых фруктов и овощей, что принесет дополнительную пользу Вашему организму. Если Вы начинаете работать над изменением диеты, помните, что для получения устойчивых изменений Вам может понадобиться несколько попыток и длительное время.");
      }
      if(this.checkQuestionAnswer('37', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Фрукты и овощи. Вы указали, что употребляете 3-4 порции фруктов или овощей каждый день. Фрукты и овощи отличный источник клетчатки. Для диеты на 2000 ккал - 4 порции фруктов и 4-5 порций овощей рекомендованы к ежедневному употреблению. Вы можете стараться увеличить количество потребляемых фруктов и овощей, что принесет дополнительную пользу Вашему организму. Если Вы начинаете работать над изменением диеты, помните, что для получения устойчивых изменений Вам может понадобиться несколько попыток и длительное время.");
      }
      if(this.checkQuestionAnswer('37', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Фрукты и овощи. Вы указали, что употребляете 1-2 порции фруктов или овощей каждый день, что недостаточно для Вашего организма. Фрукты и овощи отличный источник клетчатки. Для диеты на 2000 ккал - 4 порции фруктов и 4-5 порций овощей рекомендованы к ежедневному употреблению. В тоже время Вы можете стараться еще больше увеличить количество потребляемых фруктов и овощей. Когда Вы начинаете работать над изменением диеты, помните, что для получения устойчивых изменений Вам может понадобиться несколько попыток и длительное время.");
      }
      if(this.checkQuestionAnswer('37', '4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Фрукты и овощи. Вы указали, что употребляете редко/никогда фрукты и овощи, что крайне недостаточно для Вашего организма. Фрукты и овощи отличный источник клетчатки. Для диеты на 2000 ккал - 4 порции фруктов и 4-5 порций овощей рекомендованы к ежедневному употреблению. В тоже время Вы можете стараться еще больше увеличить количество потребляемых фруктов и овощей. Когда Вы начинаете работать над изменением диеты, помните, что для получения устойчивых изменений Вам может понадобиться несколько попыток и длительное время.");
      }
      if(this.checkQuestionAnswer('38', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Продукты  c содержанием с высоким содержанием пищевых волокон.  Вы отметили, что обычно употребляете 5-6 порций продуктов с высоким содержанием клетчатки ежедневно. Наилучшими источниками клетчатки является: цельнозерновой хлеб, бурый рис, курага, чернослив, изюм, черника, земляника, апельсины, брокколи, фасоль, горох, чечевица, соя,  кукуруза.  Старайтесь употреблять больше продуктов богатых клетчаткой чтобы укрепить иммунитет, сердечно-сосудистую систему, нервную систему. ");
      }
      if(this.checkQuestionAnswer('38', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Продукты  c содержанием с высоким содержанием пищевых волокон.  Вы отметили, что обычно употребляете 3-4 порции продуктов с высоким содержанием клетчатки ежедневно. Наилучшими источниками клетчатки является: цельнозерновой хлеб, бурый рис, курага, чернослив, изюм, черника, земляника, апельсины, брокколи, фасоль, горох, чечевица, соя,  кукуруза.  Старайтесь употреблять больше продуктов богатых клетчаткой чтобы укрепить иммунитет, сердечно-сосудистую систему, нервную систему.");
      }
      if(this.checkQuestionAnswer('38', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Продукты  c содержанием с высоким содержанием пищевых волокон.  Вы отметили, что обычно употребляете 1-2 порции продуктов с высоким содержанием клетчатки ежедневно. Вам рекомендовано увеличить употребление продуктов до 4 порций богатых клетчаткой ежедневно. Пища богатая клетчаткой включает: цельнозерновой хлеб, бурый рис, курагу, чернослив, изюм, чернику, землянику, апельсины, брокколи, фасоль, горох, чечевицу, сою, кукурузу.  Старайтесь употреблять больше продуктов богатых клетчаткой чтобы укрепить иммунитет, сердечно-сосудистую систему, нервную систему.");
      }
      if(this.checkQuestionAnswer('38', '4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Продукты  c содержанием с высоким содержанием пищевых волокон.  Вы отметили, что обычно не употребляете продукты (редко/никогда) с высоким содержанием клетчатки ежедневно. Вам рекомендовано увеличить употребление продуктов до 4 порций богатых клетчаткой ежедневно. Пища богатая клетчаткой включает: цельнозерновой хлеб, бурый рис, курагу, чернослив, изюм, чернику, землянику, апельсины, брокколи, фасоль, горох, чечевицу, сою, кукурузу.  Вы должны стараться употреблять больше продуктов богатых клетчаткой.");
      }
      if(this.checkQuestionAnswer('40', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Молочные продукты.  Вы отметили, что употребляете 5-6 порций в день молочные продукты. Рекомендованное употребление молочных продуктов 1-3 порции в день. Постарайтесь сократить количество употребляемых продуктов, чтобы сделать Ваш рацион более рациональным.");
      }
      if(this.checkQuestionAnswer('40', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Молочные продукты.  Вы отметили, что употребляете 3-4 порций в день молочные продукты. Рекомендованное употребление молочных продуктов 1-3 порции в день. Постарайтесь сократить количество употребляемых продуктов, чтобы сделать Ваш рацион более рациональным.");
      }
      if(this.checkQuestionAnswer('40', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Молочные продукты.  Вы отметили, что употребляете 1-2 порции в день молочных продуктов. Рекомендованное употребление молочных продуктов 1-3 порции в день. Ваш уровень употребления соответствует норме.");
      }
      if(this.checkQuestionAnswer('40', '4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Молочные продукты.  Вы отметили, что редко или никогда не употребляете молочные продукты. Рекомендованное употребление молочных продуктов 1-3 порции в день. Увеличьте количество употребляемых молочных продуктов, чтобы сделать Ваш рацион более рациональным.");
      }
      if(this.checkQuestionAnswer('48', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Стресс. Вы указали, что стресс не является для Вас проблемой. Как показали исследования, минимальное количество стресса полезно для нашего организма. Минимальный стресс делает нас успешнее и здоровье.");
      }
      if(this.checkQuestionAnswer('48', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Стресс. Вы указали, что стресс является проблемой  для вас. Вы указали, что иногда испытываете сильный стресс, который мешает Вашей жизни. Вы можете попробовать использовать техники стресс-менеджмента, такие как техники глубоко дыхания, йога, также Вы можете попробовать изменить отношение к стрессовым ситуациям. Вы иногда можете использовать технику «Маркирования». При стрессовой ситуации Вы можете попробовать оценить уровень стресса (сильны, не очень сильны, средний, Не очень слабый, слабый) и представить, что вы прикрепляете к стрессу «ярлык». По мнению специалистов, данная техника может помогать при среднем уровне стресса.\nЕсли Вы ощущаете, что стрессовые ситуации приводят к большим личностным, профессиональным, физическим проблемам,  Вам необходимо обратиться к специалисту.");
      }
      if(this.checkQuestionAnswer('48', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Стресс. Вы указали, что стресс является проблемой  для вас. Вы указали, что часто испытываете сильный стресс, который мешает Вашей жизни. Вы можете попробовать использовать техники стресс-менеджмента, такие как техники глубоко дыхания, йога, также Вы можете попробовать изменить отношение к стрессовым ситуациям. Вы иногда можете использовать технику «Маркирования». При стрессовой ситуации Вы можете попробовать оценить уровень стресса (сильны, не очень сильны, средний, Не очень слабый, слабый) и представить, что вы прикрепляете к стрессу «ярлык». По мнению специалистов, данная техника может помогать при среднем уровне стресса.\nЕсли Вы ощущаете, что стрессовые ситуации приводят к большим личностным, профессиональным, физическим проблемам,  Вам необходимо обратиться к специалисту.");
      }
      if(this.checkQuestionAnswer('48', '4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Стресс. Вы указали, что стресс является проблемой  для вас. Вы указали, что всегда испытываете сильный стресс, который мешает Вашей жизни. Вы можете попробовать использовать техники стресс-менеджмента, такие как техники глубоко дыхания, йога, также Вы можете попробовать изменить отношение к стрессовым ситуациям. Вы иногда можете использовать технику «Маркирования». При стрессовой ситуации Вы можете попробовать оценить уровень стресса (сильны, не очень сильны, средний, Не очень слабый, слабый) и представить, что вы прикрепляете к стрессу «ярлык». По мнению специалистов, данная техника может помогать при среднем уровне стресса.\nЕсли Вы ощущаете, что стрессовые ситуации приводят к большим личностным, профессиональным, физическим проблемам,  Вам необходимо обратиться к специалисту.");
      }
      if(this.checkQuestionAnswer('49', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Вы указали, что Всегда справляетесь со стрессом. Помните, стресс является фактором риска очень многих заболеваний, не допускайте возникновения хронического стресса.");
      }
      if(this.checkQuestionAnswer('49', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Вы указали, что Вам иногда трудно справится со стрессом. Помните, стресс является фактором риска очень многих заболеваний, не допускайте возникновения хронического стресса.");
      }
      if(this.checkQuestionAnswer('49', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Вы указали, что часто испытываете трудности, связанные со стрессом. Помните, стресс является фактором риска очень многих заболеваний, не допускайте возникновения хронического стресса.");
      }
      if(this.checkQuestionAnswer('52', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Депрессия. Вы ответили, что в течение последних 6 месяцев вы испытывали ощущение подавленности или депрессии в течение 2 недель на работе или в домашних условиях. Основываясь на Ваш ответ, Вы подвержены риску депрессии, по возможности, обратитесь к специалисту.");
      }
      if(this.checkQuestionAnswer('52', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Депрессия. Вы ответили, что в течение последних 6 месяцев вы не испытывали как минимум ощущение подавленности или депрессии в течение 2 недель на работе или в домашних условиях. Основываясь на Ваш ответ, Вы не подвержены риску депрессии.");
      }
      if(this.checkQuestionAnswer('51', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Удовлетворенность от профессиональной жизни. Вы ответили, что удовлетворены Вашей профессиональной жизнью. Если Вы почувствуете, что уровень неудовлетворенности растет, Вам необходимо обратиться к специалисту.");
      }
      if(this.checkQuestionAnswer('51', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Удовлетворенность от профессиональной жизни. Вы ответили, что больше удовлетворены, чем нет Вашей профессиональной жизнью. Если Вы почувствуете, что уровень неудовлетворенности растет, Вам необходимо обратиться к специалисту");
      }
      if(this.checkQuestionAnswer('51', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Удовлетворенность от профессиональной жизни. Вы ответили, что частично удовлетворены Вашей профессиональной жизнью. Если Вы почувствуете, что уровень неудовлетворенности растет, Вам необходимо обратиться к специалисту");
      }
      if(this.checkQuestionAnswer('51', '4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Удовлетворенность от профессиональной жизни. Вы ответили, что не удовлетворены Вашей профессиональной жизнью, по возможности, обратитесь к специалисту.");
      }
      if(this.checkQuestionAnswer('50', '1', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Удовлетворенность личной жизнью. Вы ответили, что вы удовлетворены вашей личной жизнью. Очень важно иметь позитивное отношение к происходящему, даже если на пути встречаются трудности. Поддерживать в отличном состоянии душевное здоровье Вам поможет регулярная физическая нагрузка.");
      }
      if(this.checkQuestionAnswer('50', '2', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Удовлетворенность личной жизнью. Вы ответили, что вы больше удовлетворены, чем нет вашей личной жизнью. Очень важно иметь позитивное отношение к происходящему, даже если на пути встречаются трудности. Поддерживать в отличном состоянии душевное здоровье Вам поможет регулярная физическая нагрузка.");
      }
      if(this.checkQuestionAnswer('50', '3', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Удовлетворенность личной жизнью. Вы ответили, что вы частично удовлетворены вашей личной жизнью. Очень важно иметь позитивное отношение к происходящему, даже если на пути встречаются трудности. Поддерживать в отличном состоянии душевное здоровье Вам поможет регулярная физическая нагрузка.");
      }
      if(this.checkQuestionAnswer('50', '4', 'equal')) {
        this.reportTest.section3.lifeStyle.push("Удовлетворенность личной жизнью. Вы ответили, что вы не удовлетворены вашей личной жизнью. Очень важно иметь позитивное отношение к происходящему, даже если на пути встречаются трудности. Поддерживать в отличном состоянии душевное здоровье Вам поможет регулярная физическая нагрузка. Если Вы чувствуете, что неудовлетворённость в личной жизни может привести к негативным последствиям, обратитесь к специалисту.");
      }

      console.log("this.reportTest", this.reportTest.section1);
      req.reportTest = this.reportTest;
      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

}

module.exports = new TestService();