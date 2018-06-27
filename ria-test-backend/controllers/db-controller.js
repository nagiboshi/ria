const BaseController = require('../controllers/base-controller');
const Session = require('../models/session');
const Request = require('../models/request');
const RiskGroup = require('../models/riskGroup');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('jconf');
class DbController extends BaseController {
    constructor() {
        super();     
    }

    async setup(req, res, next){ 
        let users = await User.find();
        if( users && users.length == 0 ) {     
            let sessions = await Session.find();
            let resultedStr = 'Removing sessions: ';
            sessions.forEach((session) => {
                    resultedStr+='<br/>';
                    resultedStr+='removing session ' + session._id + '<br/>'; 
                session.remove();     
            });
            resultedStr+='------Sessions removed------ <br/>';
            resultedStr+='Removing requests: ';
            let requests = await Request.find();
            requests.forEach((request) => {
                    resultedStr+='\n';
                    resultedStr+='removing request ' + request._id + '<br/>';
                request.remove();
            });

            resultedStr+='------Requests removed------ <br/>';

            resultedStr+='Creating default user "admin"  with password "admin" <br/>';
            await new User({
                email: 'ria.test.acc@gmail.com',
                password: jwt.sign('admin', config.baseKey),
                role: 'admin'
            }).save();
            resultedStr+='Creating default user "user" with password "user" <br/>';
            await new User({
                email: 'user',
                password: jwt.sign('user', config.baseKey),
                role: 'user'
            }).save();
            resultedStr+="Default users created <br/>";


            resultedStr+="Adding default risk groups <br/>";
            let riskGroups = await RiskGroup.find();
            riskGroups.forEach((riskGroup) => {
                riskGroup.remove();
            });
            await new RiskGroup({
                name: 'Онкология'
            }).save();
            resultedStr+="Adding Онкология <br/>";
            await new RiskGroup({
                name: 'Диабет'
            }).save();
            resultedStr+="Adding Диабет <br/>";
            await new RiskGroup({
                name: 'Болезни сердечно-сосудистой системы'
            }).save();
            resultedStr+="Adding Болезни сердечно-сосудистой системы <br/>";
            await new RiskGroup({
                name: 'Психосоматические заболевания'
            }).save();
            resultedStr+="Adding Психосоматические заболевания <br/>";
            
            resultedStr+='------- Setup complete ---------- ';
            res.send(resultedStr);
            //   next();
        } else {
            res.send('Failed. Aready installed');
        }
}
}

module.exports = new DbController();