export class SQLValidator {
    static forbiddenCommands = [
        'create', 'drop', 'truncate', 'delete', 
        'update', 'insert', 'alter', 'grant',
        'revoke', 'commit', 'rollback', 'merge',
        'lock', 'unlock', 'shutdown', 'exec',
        'xp_', 'sp_', 'dbcc', 'backup', 'restore'
    ];

    static dangerousPatterns = [
        /;\s*$/i,
        /--\s|\/\*.*\*\//i,
        /exec(\s|\()/i,
        /xp_cmdshell/i,
        /union.*select/i,
        /waitfor\s+delay/i,
        /having\s+1=1/i,
        /sleep\(\d+\)/i
    ];

    static validate(sql) {
        if (!sql) throw new Error('Consulta SQL vazia');

        const normalizedSQL = sql.toLowerCase().trim();
        
        if (!normalizedSQL.startsWith('select')) {
            throw new Error('Apenas consultas SELECT são permitidas');
        }

        // Verificação de comandos proibidos
        this.forbiddenCommands.forEach(cmd => {
            const regex = new RegExp(`\\b${cmd}\\b`, 'i');
            if (regex.test(normalizedSQL)) {
                throw new Error(`Comando proibido detectado: ${cmd}`);
            }
        });

        // Verificação de padrões perigosos
        this.dangerousPatterns.forEach(pattern => {
            if (pattern.test(normalizedSQL)) {
                throw new Error('Padrão de SQL injection detectado');
            }
        });

        // Verificação de tabelas não autorizadas
        const allowedTables = [
            'occurrence_air', 'occurrence_land', 
            'pilot', 'service_order', 
            'user', 'log'
        ];
        
        const tableRegex = /from\s+([^\s,)(;]+)/gi;
        let match;
        while ((match = tableRegex.exec(normalizedSQL)) !== null) {
            const table = match[1].replace(/["`]/g, '');
            if (!allowedTables.includes(table)) {
                throw new Error(`Acesso a tabela não permitida: ${table}`);
            }
        }

        return true;
    }
}