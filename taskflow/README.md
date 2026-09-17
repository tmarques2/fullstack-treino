# Taskflow Frontend

Interface web para gerenciamento de tarefas. Este projeto foi criado como um exemplo prático para estudar como uma aplicação Angular é organizada e como uma interação na tela percorre os componentes até a API REST.

## O que o projeto faz

O frontend permite:

- listar tarefas cadastradas;
- criar uma tarefa com título, prioridade e prazo opcional;
- filtrar tarefas por status e prioridade;
- pesquisar tarefas pelo título;
- alterar o título de uma tarefa;
- alternar uma tarefa entre concluída e pendente;
- excluir uma tarefa com confirmação;
- exibir estados de carregamento, erro, lista vazia e notificações de sucesso.

Os dados são persistidos pelo backend em `taskflow-api`. Por isso, a API precisa estar em execução para que a tela consiga carregar e alterar tarefas.

## Tecnologias

- **Angular 21**: framework da aplicação;
- **TypeScript**: linguagem do frontend;
- **Angular Signals**: controle do estado reativo dos componentes;
- **Angular Router**: suporte à navegação da aplicação;
- **Angular HttpClient**: comunicação com a API REST;
- **RxJS**: observables usados nas chamadas HTTP;
- **Vitest**: execução dos testes unitários;
- **npm**: gerenciamento de dependências e scripts.

## Estrutura do projeto

```text
src/
├── app/
│   ├── app.ts
│   ├── app.html
│   ├── app.css
│   ├── core/
│   │   ├── models/
│   │   │   ├── task-filter.model.ts
│   │   │   └── task.model.ts
│   │   └── services/
│   │       ├── task.ts
│   │       └── task.spec.ts
│   ├── features/tasks/
│   │   ├── task-filters/
│   │   ├── task-form/
│   │   ├── task-item/
│   │   ├── task-list/
│   │   ├── task-search/
│   │   ├── task-summary/
│   │   └── task-toolbar/
│   └── shared/components/
│       ├── task-delete-confirm-dialog/
│       ├── task-empty-state/
│       ├── task-error-state/
│       ├── task-loading/
│       └── task-toast/
├── main.ts
├── main.server.ts
└── styles.css
```

### Componente raiz: `App`

`App` é o componente raiz da aplicação. Ele importa o `TaskList`, que coordena a tela principal de tarefas.

### Serviço: `TaskService`

`TaskService` concentra a comunicação HTTP com o backend. A URL usada localmente é `http://localhost:8080/api/tasks`.

Ele oferece métodos para:

- buscar todas as tarefas;
- criar uma tarefa;
- alternar o status de conclusão;
- atualizar o título;
- excluir uma tarefa.

Os componentes usam os `Observable`s retornados pelo serviço para atualizar a interface após cada operação.

### Componentes de tarefas

Os componentes em `features/tasks` dividem a tela em responsabilidades menores:

- `TaskList`: carrega e organiza as tarefas;
- `TaskForm`: coleta os dados de uma nova tarefa;
- `TaskItem`: apresenta e edita uma tarefa individual;
- `TaskFilters`: filtra por status e prioridade;
- `TaskSearch`: pesquisa pelo título;
- `TaskSummary`: exibe um resumo da lista;
- `TaskToolbar`: reúne ações da tela.

### Componentes compartilhados

Os componentes em `shared/components` representam estados e interações reutilizáveis, como carregamento, erro, lista vazia, toast e confirmação de exclusão.

## Como uma interação funciona

Ao criar uma tarefa, o fluxo principal é:

```text
Usuário preenche o formulário
	↓ submit
TaskForm
	↓ dados da tarefa
TaskList
	↓ TaskService.addTask()
HttpClient
	↓ POST /api/tasks
Taskflow API
	↓ resposta JSON
TaskList atualiza os sinais e a interface
```

## Executando o projeto

Pré-requisito: Node.js 20.19 ou superior e npm.

Instale as dependências:

```powershell
npm install
```

Inicie o servidor de desenvolvimento:

```powershell
npm start
```

Depois, abra `http://localhost:4200/` no navegador. A aplicação recarrega automaticamente quando os arquivos são alterados.

O backend também deve estar em execução em `http://localhost:8080`. Na pasta `taskflow-api`, use:

```powershell
./mvnw.cmd spring-boot:run
```

## Build

Para gerar a versão de produção:

```powershell
npm run build
```

Os arquivos compilados serão gerados em `dist/`.

## Testes

Para executar os testes unitários:

```powershell
npm test
```

Os testes usam o [Vitest](https://vitest.dev/) por meio da configuração do Angular.

## Comandos úteis

```powershell
npm start       # servidor de desenvolvimento
npm run build   # build de produção
npm test        # testes unitários
npm run watch   # build contínuo em modo development
```

Para mais informações, consulte a [documentação do Angular](https://angular.dev/).
