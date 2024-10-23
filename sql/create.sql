CREATE TABLE IF NOT EXISTS Professores (
    professor_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    hashEmail TEXT UNIQUE NOT NULL,
    hashSenha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Turmas (
    turma_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    professor_id INTEGER NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES Professores(professor_id)
);

CREATE TABLE IF NOT EXISTS Atividades (
    atividade_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    turma_id INTEGER NOT NULL,
    FOREIGN KEY (turma_id) REFERENCES Turmas(turma_id)
);