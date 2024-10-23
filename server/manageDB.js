//MODULES ---------------------------------------
const sqlite3 = require('sqlite3').verbose();
const sha1 = require('sha1');

//MY DB SETUP -----------------------------------
const DB_NAME = 'banco_db';
const DB_PATH = `./${DB_NAME}.db`
const DEFAULT_DB = openDB();

//LOAD and CLOSE --------------------------------
function openDB(path = DB_PATH) {
    let db = new sqlite3.Database(path, (error) => {
        if (error) {
            console.log('Erro openDB:', error);
        } else {
            console.log(`Banco em '${path}' aberto.`);
        }
    });
    return db;
}

function closeDB(db = DEFAULT_DB, path = DB_PATH) {
    db.close((error) => {
        if (error) {
            console.log('Erro closeDB:', error);
        } else {
            console.log(`Banco em '${path}' fechado.`)
        }
    });
    
    return null;
}

// INSERT FUNCTIONS ------------------------------
function cadastrarProfessor(nome, email, senha, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const hashEmail = sha1(email);
        const hashSenha = sha1(senha);
        const query = `INSERT INTO Professores(nome, hashEmail, hashSenha) VALUES (?, ?, ?);`
        db.run(query, [nome, hashEmail, hashSenha], (error) => {
            if (error) {
                console.error('Erro CadProf:', error);
                reject(error);
            } else {
                console.log(`prof. ${nome} adicionado`);
                resolve(!error);
            }
        })
    });
}

function cadastrarTurma(nome, professor_id, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Turmas(nome, professor_id) VALUES (?, ?);`
        db.run(query, [nome, professor_id], (error) => {
            if (error) {
                console.error('Erro CadTurma:', error);
                reject(error);
            } else {
                console.log(`turma ${nome} adicionada`);
                resolve(!error);
            }
        })
    });
}

function cadastrarAtividade(descricao, turma_id, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Atividades(descricao, turma_id) VALUES (?, ?);`
        db.run(query, [descricao, turma_id], (error) => {
            if (error) {
                console.error('Erro CadTurma:', error);
                reject(error);
            } else {
                console.log(`atividade '${descricao}' adicionada`);
                resolve(!error);
            }
        })
    });
}

//DELETE FUNCTIONS -------------------------------
function deletarTurmaPorId(turma_id, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM Turmas WHERE turma_id = ?`
        db.run(query, [turma_id], (error) => {
            if (error) {
                console.error('Erro DelTurma:', error);
                reject(error);
            } else {
                console.log(`turma ${turma_id} removida`);
                resolve(!error);
            }
        })
    });
}

// SELECT FUNCTIONS ------------------------------
function obterProfessorPorEmail(email, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const hashEmail = sha1(email);
        const query = `SELECT * FROM Professores WHERE hashEmail = ?`;
        db.get(query, [hashEmail], (error, professor) => {
            if (error) {
                console.log('Obter Prof/Id error: ', error);
                reject(error);
            } else {
                resolve(professor);
            }
        })
    })
}

function obterTurmasPorId(professor_id, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Turmas WHERE professor_id = ?`;
        db.all(query, [professor_id], (error, turmas) => {
            if (error) {
                console.log('Obter Prof/Id error: ', error);
                reject(error);
            } else {
                resolve(turmas);
            }
        })
    })
}

function obterAtividadesPorId(turma_id, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Atividades WHERE turma_id = ?`;
        db.all(query, [turma_id], (error, atividades) => {
            if (error) {
                console.log('Obter Prof/Id error: ', error);
                reject(error);
            } else {
                resolve(atividades);
            }
        })
    })
}

//EXPORTS ----------------------------------------
module.exports = {
    openDB,
    closeDB,
    cadastrarProfessor,
    cadastrarTurma,
    cadastrarAtividade,
    deletarTurmaPorId,
    obterProfessorPorEmail,
    obterTurmasPorId,
    obterAtividadesPorId,
}