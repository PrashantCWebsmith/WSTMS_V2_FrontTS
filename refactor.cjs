const fs = require('fs');
const glob = require('glob');

const basePath = 'src/features';
const modules = ['users', 'roles', 'projects', 'tasks', 'smtp', 'task-type', 'leave', 'priority', 'incidents', 'scheduler'];

for (const mod of modules) {
    console.log(`Processing ${mod}`);
    let serviceFiles;
    try {
        serviceFiles = fs.readdirSync(`${basePath}/${mod}/services`).filter(f => f.endsWith('.service.ts'));
    } catch (e) {
        continue;
    }
    
    if (serviceFiles.length === 0) continue;
    const serviceFile = `${basePath}/${mod}/services/${serviceFiles[0]}`;
    let content = fs.readFileSync(serviceFile, 'utf-8');
    
    let classPrefix = mod.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    if (mod === 'task-type') classPrefix = 'TaskType';
    if (mod === 'scheduler') classPrefix = 'Scheduler';
    if (mod === 'smtp') classPrefix = 'SMTP';
    
    if (!content.includes('ActionStatusEnum') && mod !== 'task-status') {
        const importStr = "import type { ActionRequestDto } from '@/types/api.types';\nimport { ActionStatusEnum } from '@/types/api.types';\n";
        content = content.replace(/(import api from .*?;)/, `$1\n${importStr}`);
        
        const deleteRegex = new RegExp(`delete: async \\(id: number\\): Promise<SQLReturnMessageNValue> => \\{\\s*return ${classPrefix}Service\\.generalAction\\(id, 'Delete'\\);\\s*\\},`);
        content = content.replace(deleteRegex, `delete: async (id: number): Promise<SQLReturnMessageNValue> => {\n    return ${classPrefix}Service.generalAction({ id, action: ActionStatusEnum.Delete });\n  },`);
        
        if (mod === 'tasks') {
            const generalActionRegex = /generalAction: async \(id: number, action: string, remarks\?: string\): Promise<SQLReturnMessageNValue> => \{\s*const response = await api\.post<SQLReturnMessageNValue>\(`\/[A-Za-z]+\/Action`, \{ id, action, remarks \}\);\s*return response\.data;\s*\}/;
            content = content.replace(generalActionRegex, `generalAction: async (params: ActionRequestDto & { remarks?: string }): Promise<SQLReturnMessageNValue> => {\n    const response = await api.post<SQLReturnMessageNValue>(\`/Task/Action\`, params);\n    return response.data;\n  }`);
        } else {
            const generalActionRegex = /generalAction: async \(id: number, action: string\): Promise<SQLReturnMessageNValue> => \{\s*const response = await api\.post<SQLReturnMessageNValue>\(`(\/.*)\/Action`, \{ id, action \}\);\s*return response\.data;\s*\}/;
            content = content.replace(generalActionRegex, `generalAction: async (params: ActionRequestDto): Promise<SQLReturnMessageNValue> => {\n    const response = await api.post<SQLReturnMessageNValue>(\`$1/Action\`, params);\n    return response.data;\n  }`);
        }
        
        fs.writeFileSync(serviceFile, content, 'utf-8');
    }

    let queryFiles;
    try {
        queryFiles = fs.readdirSync(`${basePath}/${mod}/hooks/queries`).filter(f => f.endsWith('.queries.ts'));
    } catch (e) {
        continue;
    }
    
    if (queryFiles.length === 0) continue;
    const queryFile = `${basePath}/${mod}/hooks/queries/${queryFiles[0]}`;
    let queryContent = fs.readFileSync(queryFile, 'utf-8');
    
    if (!queryContent.includes('ActionStatusEnum') && mod !== 'task-status') {
        const importStr = "import { ActionStatusEnum } from '@/types/api.types';\n";
        queryContent = queryContent.replace(/(import \{ useQuery.*?;)/, `$1\n${importStr}`);
        
        const deleteQueryRegex = new RegExp(`mutationFn: \\(id: number\\) => ${classPrefix}Service\\.delete\\(id\\),`);
        queryContent = queryContent.replace(deleteQueryRegex, `mutationFn: (id: number) => ${classPrefix}Service.generalAction({ id, action: ActionStatusEnum.Delete }),`);
        
        const statusQueryRegex = new RegExp(`mutationFn: \\(id: number\\) => ${classPrefix}Service\\.generalAction\\(id, 'STATUS'\\),`);
        queryContent = queryContent.replace(statusQueryRegex, `mutationFn: (id: number) => ${classPrefix}Service.generalAction({ id, action: ActionStatusEnum.Status }),`);
        
        if (mod === 'tasks') {
            const taskRemarksRegex = /mutationFn: \(\w+: \{ id: number; action: string; remarks\?: string \}\) => TaskService\.generalAction\(\w+\.id, \w+\.action, \w+\.remarks\),/;
            queryContent = queryContent.replace(taskRemarksRegex, `mutationFn: (params: { id: number; action: ActionStatusEnum | string; remarks?: string }) => TaskService.generalAction(params),`);
            
            const taskDeleteRegex = /mutationFn: \(id: number\) => TaskService\.generalAction\(id, 'Delete'\),/;
            queryContent = queryContent.replace(taskDeleteRegex, `mutationFn: (id: number) => TaskService.generalAction({ id, action: ActionStatusEnum.Delete }),`);
        }
        
        fs.writeFileSync(queryFile, queryContent, 'utf-8');
    }
}
console.log('Done');
