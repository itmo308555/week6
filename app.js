
export default function appScr(express, bodyParser, fs, crypto, http, CORS, User, m) {
    const app = express();
    const hu = {'Content-Type':'text/html; charset=utf-8'}
    let headers = {
        'Content-Type':'text/plain',
        ...CORS
    }
    app
        .use(bodyParser.urlencoded({extended:true}))       
        .all('/login/', (req, res) => {
            res.set(headers)
            res.send('itmo307709');
        })
        .all('/code/', (req, res) => {
            res.set(headers)
            fs.readFile(import.meta.url.substring(7),(err, data) => {
                if (err) throw err;
                res.end(data);
              });           
        })
        .all('/sha1/:input/', (req, res) => {
            res.set(headers)
            let shasum = crypto.createHash('sha1')
            res.send(shasum.update(req.params.input).digest('hex'))
        })
        .get('/req/', (req, res) =>{
            res.set(headers);
            let data = '';
            http.get(req.query.addr, async function(response) {
                await response.on('data',function (chunk){
                    data+=chunk;
                }).on('end',()=>{})
                res.send(data)
            })
        })
        .post('/req/', (req, res) =>{
            res.set(headers);
            const {addr} = req.body;
            res.send(addr)
        })
        .post('/insert/', async (req,res)=>{
            res.set(headers);
            const {login,password,URL}=req.body;
            const newUser = new User({login,password});
            try{
                await m.connect(URL, {useNewUrlParser:true, useUnifiedTopology:true});
                try{
                    await newUser.save();
                    res.status(201).json({'Добавлено: ':login});
                }
                catch(e){
                    res.status(400).json({'Ошибка: ':'Нет пароля'});
                }
            }
            catch(e){
                console.log(e.codeName);
            }      
        })
        .use(({res:r})=>r.status(404).set(hu).send('itmo307709'))
    return app;
}