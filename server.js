// MODULES -----------------------------------------
const manageDB = require('./server/manageDB.js');
const path = require('path');
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const sha1 = require('sha1');

const PORT = 1101;

// IMPORT FOLDERS -----------------------------------
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));

//BODY PARSER ---------------------------------------
app.use(bodyParser.urlencoded({extended: true}))

//EXPRESS SESSION -----------------------------------
app.use(session({
    secret: 'log_key',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

//EJS -----------------------------------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'html'))

// ROUTES -------------------------------------------

//Home: get = página / post = logar
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html','index.html'));
});
app.post('/', async (req, res) => {
    const {email, senha} = req.body;
    const professor_existe = await manageDB.obterProfessorPorEmail(email);
    if (!professor_existe) {
        res.redirect('/?error=1');
    } else if (professor_existe.hashSenha != sha1(senha)) {
        res.redirect('/?error=2');
    } else {
        const user = {
            id: professor_existe.professor_id,
            nome: professor_existe.nome
        }
        req.session.user = user;
        res.redirect('/turmas');
    }
});

//Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/turmas');
        }
        res.redirect('/');
    });
})

//Cadastro de Prof: get = página / post = cadastrar se válido
app.get('/professor_cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'html','professor_cadastro.html'));
})
app.post('/professor_cadastro', async (req, res) => {
    const {nome, email, senha, confirma} = req.body;
    const professor_existe = await manageDB.obterProfessorPorEmail(email);
    if (senha != confirma) {
        res.redirect('/professor_cadastro?error=1');
    } else if (professor_existe) {
        res.redirect('/professor_cadastro?error=2');
    } else {
        await manageDB.cadastrarProfessor(nome, email, senha);
        res.redirect('/professor_cadastro?success=1');
    }
});

//Menu painel de turmas: get = gerar página / post = cadastrar turma / delete = excluir turma
app.get('/turmas', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/'); //Precisa logar
    }

    const user = req.session.user;
    const turmas = await manageDB.obterTurmasPorId(user.id);
    // console.log()
    res.render('turmas', {user: user, turmas: turmas});
})
app.post('/turmas', async (req, res) => {
    const { nome, professor_id } = req.body;
    await manageDB.cadastrarTurma(nome, professor_id);
    res.redirect('/turmas?success=1');
})
app.get('/turma_del/:id', async (req, res) => {
    const turma_id = req.params.id;
    const atividades = await manageDB.obterAtividadesPorId(turma_id);
    console.log(`${atividades}`);
    if (atividades.length) {
        res.redirect('/turmas?error=1');
    } else {
        await manageDB.deletarTurmaPorId(turma_id);
        res.redirect('/turmas?success=2');
    }
})

//Menu painel de atividades: get = gerar página / post = cadastrar atividade
app.get('/atividades/:id', async (req, res) => {
    const turma_id = req.params.id;
    const user = req.session.user;
    const atividades = await manageDB.obterAtividadesPorId(turma_id);
    res.render('atividades', {user: user, turma_id: turma_id, atividades: atividades});
});
app.post('/atividades', async (req, res) => {
    const {descricao, turma_id} = req.body;
    await manageDB.cadastrarAtividade(descricao, turma_id);
    res.redirect('/atividades?success=1');
});

// START SERVER -------------------------------------
app.listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT}/`);
})