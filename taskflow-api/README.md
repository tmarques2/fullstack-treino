# Taskflow API

API REST para gerenciamento de tarefas. Este projeto foi criado como um exemplo prático para estudar como uma aplicação Spring Boot é organizada e como uma requisição HTTP percorre as camadas de uma aplicação.

## O que o projeto faz

A API permite:

- listar todas as tarefas;
- criar uma tarefa com título, prioridade e prazo opcional;
- alterar o título de uma tarefa;
- alternar o status de concluída para pendente, ou de pendente para concluída;
- excluir uma tarefa.

Os dados são armazenados em um banco H2 em memória. Isso é ótimo para aprendizado, porque não exige instalar um banco externo, mas também significa que os dados são perdidos quando a aplicação é encerrada.

## Tecnologias

- **Java 17**: linguagem da aplicação;
- **Spring Boot 4.1.1**: configuração e inicialização da aplicação;
- **Spring Web MVC**: criação dos endpoints REST;
- **Spring Data JPA**: acesso ao banco usando interfaces e entidades Java;
- **Bean Validation**: validação dos dados recebidos pela API;
- **H2**: banco de dados relacional em memória;
- **Maven**: gerenciamento de dependências e execução do projeto.

## Estrutura do projeto

```text
src/
├── main/
│   ├── java/taskflow_api/
│   │   ├── TaskflowApiApplication.java
│   │   ├── controller/
│   │   │   └── TaskController.java
│   │   ├── dto/
│   │   │   ├── CreateTaskRequest.java
│   │   │   └── UpdateTaskRequest.java
│   │   ├── model/
│   │   │   ├── Task.java
│   │   │   └── TaskPriority.java
│   │   ├── repository/
│   │   │   └── TaskRepository.java
│   │   └── service/
│   │       └── TaskService.java
│   └── resources/
│       └── application.properties
└── test/
    └── java/taskflow_api/
        └── TaskflowApiApplicationTests.java
```

### `TaskflowApiApplication`

É o ponto de entrada da aplicação:

```java
SpringApplication.run(TaskflowApiApplication.class, args);
```

`@SpringBootApplication` reúne três comportamentos importantes:

1. **Configuração automática** (`@EnableAutoConfiguration`): o Spring observa as dependências instaladas e configura componentes como servidor web, JPA e banco de dados.
2. **Configuração de aplicação** (`@SpringBootConfiguration`): indica que esta é a classe principal de configuração do projeto.
3. **Varredura de componentes** (`@ComponentScan`): procura classes anotadas com `@Controller`, `@Service`, `@Repository`, entre outras, a partir do pacote `taskflow_api`.

Por isso, manter a classe principal no pacote raiz é importante: os subpacotes são encontrados automaticamente.

### Controller: `TaskController`

O controller é a porta de entrada HTTP. Ele não deve conter regras de negócio complexas; sua função é traduzir HTTP para chamadas Java e transformar o resultado em resposta HTTP.

- `@RestController`: registra a classe como componente Spring e informa que os retornos dos métodos devem virar JSON.
- `@RequestMapping("/api/tasks")`: define o prefixo comum dos endpoints.
- `@GetMapping`, `@PostMapping`, `@PatchMapping` e `@DeleteMapping`: associam métodos HTTP a métodos Java.
- `@RequestBody`: converte o JSON do corpo da requisição para um DTO.
- `@PathVariable`: extrai `taskId` da URL.
- `@ResponseStatus`: define um status HTTP específico, como `201 Created` e `204 No Content`.
- `@CrossOrigin`: permite chamadas vindas do frontend em `http://localhost:4200`.

O controller recebe `TaskService` pelo construtor. Essa é a **injeção de dependência**: o Spring cria o service e entrega a instância pronta ao controller.

### DTOs: `CreateTaskRequest` e `UpdateTaskRequest`

DTO significa **Data Transfer Object**. Esses objetos representam o formato dos dados que entram na API. Eles são separados da entidade do banco para evitar expor diretamente o formato de persistência como contrato de entrada.

Os DTOs são `record`s do Java, portanto são objetos compactos e imutáveis, com métodos de acesso como `title()`, `priority()` e `dueDate()`.

As validações do DTO de criação são:

- `@NotBlank`: o título não pode ser nulo, vazio ou formado apenas por espaços;
- `@Size(max = 120)`: o título pode ter no máximo 120 caracteres;
- `@FutureOrPresent`: o prazo deve ser hoje ou uma data futura.

O DTO de atualização valida apenas o novo título. A anotação `@Valid` no controller ativa essas regras. Se o JSON for inválido, o Spring interrompe a execução antes de chamar o service e retorna uma resposta de erro de validação.

### Service: `TaskService`

O service contém as regras de negócio:

- cria tarefas como pendentes;
- aplica `MEDIUM` quando a prioridade não foi informada;
- remove espaços extras do título com `trim()`;
- alterna o valor de `completed`;
- procura a tarefa antes de atualizar ou excluir;
- lança `ResponseStatusException` com `404 Not Found` quando o ID não existe.

Essa camada fica entre o controller e o repository. Assim, o controller não precisa conhecer detalhes do banco e o repository não precisa conhecer regras da aplicação.

### Entity: `Task`

`Task` é a entidade JPA e representa uma linha da tabela `tasks`.

- `@Entity`: informa que a classe será gerenciada pelo JPA;
- `@Table(name = "tasks")`: define o nome da tabela;
- `@Id`: identifica a chave primária;
- `@GeneratedValue`: permite que o banco gere o ID;
- `@Column(nullable = false, length = 120)`: configura restrições da coluna;
- `@Enumerated(EnumType.STRING)`: salva a prioridade como texto (`LOW`, `MEDIUM` ou `HIGH`), em vez de depender da posição do enum;
- `@PrePersist`: método executado pelo JPA antes do primeiro insert, preenchendo `createdAt` com a data e hora atuais.

O campo `createdAt` é `updatable = false`, então é criado uma vez e não deve mudar nas atualizações.

### Enum: `TaskPriority`

Define os valores permitidos para prioridade:

```text
LOW, MEDIUM, HIGH
```

Como o campo é um enum, a API rejeita valores que não pertençam a essa lista.

### Repository: `TaskRepository`

```java
public interface TaskRepository extends JpaRepository<Task, Long>
```

Não é necessário escrever uma implementação. O Spring Data cria um objeto em tempo de execução e fornece métodos prontos, como:

- `findAll()`: busca todas as tarefas;
- `findById(id)`: busca uma tarefa e retorna `Optional<Task>`;
- `save(task)`: insere ou atualiza;
- `delete(task)`: exclui.

O `Long` representa o tipo do ID da entidade `Task`.

## Como uma requisição funciona

Uma criação de tarefa segue este caminho:

```text
Cliente HTTP
    ↓ JSON + POST /api/tasks
TaskController
    ↓ @RequestBody + @Valid
CreateTaskRequest
    ↓ dados válidos
TaskService
    ↓ regras: trim, MEDIUM padrão, completed=false
TaskRepository
    ↓ save()
JPA/Hibernate
    ↓ SQL INSERT
Banco H2
    ↓ entidade salva
Resposta JSON com HTTP 201
```

No caminho de leitura, o repository executa uma consulta, o JPA transforma cada linha em um objeto `Task`, e o `@RestController` transforma os objetos retornados em JSON usando o suporte web do Spring.

## Endpoints

### Listar tarefas

```http
GET /api/tasks
```

Resposta `200 OK`:

```json
[
  {
    "id": 1,
    "title": "Estudar Spring",
    "completed": false,
    "priority": "HIGH",
    "dueDate": "2026-09-20",
    "createdAt": "2026-09-17T10:30:00"
  }
]
```

### Criar tarefa

```http
POST /api/tasks
Content-Type: application/json
```

Corpo:

```json
{
  "title": "Estudar Spring",
  "priority": "HIGH",
  "dueDate": "2026-09-20"
}
```

Retorna `201 Created`. `priority` e `dueDate` são opcionais; quando a prioridade não é enviada, o service usa `MEDIUM`.

### Alternar conclusão

```http
PATCH /api/tasks/1/toggle
```

Retorna `200 OK` com a tarefa atualizada.

### Atualizar título

```http
PATCH /api/tasks/1
Content-Type: application/json
```

```json
{
  "title": "Estudar Spring Boot"
}
```

Retorna `200 OK`.

### Excluir tarefa

```http
DELETE /api/tasks/1
```

Retorna `204 No Content` quando a exclusão é concluída.

## Executando o projeto

Pré-requisito: Java 17 ou superior.

No Windows:

```powershell
./mvnw.cmd spring-boot:run
```

No macOS/Linux:

```bash
./mvnw spring-boot:run
```

A API ficará disponível em `http://localhost:8080`.

Também é possível gerar o JAR e executá-lo:

```powershell
./mvnw.cmd clean package
java -jar target/taskflow-api-0.0.1-SNAPSHOT.jar
```

## Testando com cURL

```powershell
curl.exe http://localhost:8080/api/tasks

curl.exe -X POST http://localhost:8080/api/tasks `
  -H "Content-Type: application/json" `
  -d '{"title":"Aprender JPA","priority":"MEDIUM"}'

curl.exe -X PATCH http://localhost:8080/api/tasks/1/toggle

curl.exe -X PATCH http://localhost:8080/api/tasks/1 `
  -H "Content-Type: application/json" `
  -d '{"title":"Aprender Spring Data JPA"}'

curl.exe -X DELETE http://localhost:8080/api/tasks/1
```

## Banco H2 e configuração

As configurações estão em `src/main/resources/application.properties`:

- `spring.datasource.url`: cria o banco em memória chamado `taskflowdb`;
- `spring.datasource.username` e `password`: credenciais do H2;
- `spring.jpa.hibernate.ddl-auto=update`: permite ao Hibernate criar ou atualizar a estrutura da tabela;
- `spring.jpa.show-sql=true`: exibe SQL no console, útil para estudo;
- `spring.h2.console.enabled=true`: ativa o console web do H2;
- `spring.h2.console.path=/h2-console`: define o endereço do console.

Com a aplicação rodando, acesse `http://localhost:8080/h2-console` e use:

```text
JDBC URL: jdbc:h2:mem:taskflowdb
User Name: sa
Password: deixe vazio
```

Em um projeto real, normalmente seriam usados PostgreSQL ou MySQL, variáveis de ambiente para credenciais e uma estratégia de migração de banco como Flyway ou Liquibase.

## Testes

O teste `TaskflowApiApplicationTests` usa `@SpringBootTest` para carregar o contexto completo do Spring. O método `contextLoads()` verifica se a aplicação consegue iniciar com suas configurações, beans e dependências.

Para executar:

```powershell
./mvnw.cmd test
```

Esse é um teste de integração básico. Para aumentar a cobertura, os próximos testes naturais seriam testes do service, testes do controller com `MockMvc` e testes da persistência com H2.

## Conceitos principais para estudar

1. **Inversão de controle**: o Spring cria e administra objetos, chamados de beans.
2. **Injeção de dependência**: classes recebem suas dependências pelo construtor, em vez de criá-las com `new`.
3. **Component scanning**: o Spring encontra classes anotadas automaticamente.
4. **MVC**: o controller recebe a requisição, o service decide o comportamento e o repository acessa os dados.
5. **ORM/JPA**: objetos Java são associados a tabelas relacionais.
6. **Validação declarativa**: regras ficam em anotações como `@NotBlank` e `@Size`.
7. **Serialização JSON**: objetos Java retornados pelo controller são convertidos em JSON na resposta HTTP.
8. **Ciclo de vida JPA**: callbacks como `@PrePersist` executam em momentos específicos da persistência.

Uma boa sequência de estudo é alterar uma regra no `TaskService`, observar o JSON retornado, ativar `spring.jpa.show-sql`, acompanhar o SQL gerado e depois escrever um teste para proteger o comportamento.