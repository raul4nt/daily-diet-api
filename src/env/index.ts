import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
  // o NODE_ENV é preenchido automaticamente quando usamos
  // vitest como 'test'. ou seja, se o NODE_ENV estiver como test,
  // estamos executando testes. logo, quero usar o .env de teste
} else {
  config()
  // se nao for 'test', singifica que nao estou rodando teste e sim
  // executando a aplicação normalmente, então, por default, o
  // config procurará o .env normal, e nao o .env.test
}

// cria um esquema que espera um  objeto com
// determinadas chaves e valores
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  PORT: z.coerce.number().default(3333),
  // se tiver uma porta, ok, usa a que tem
  // se não tiver, vai usar o valor como 3333(valor default)
  JWT_SECRET: z.string(),
})

// o esquema exige que exista uma chave chamada DATABASE_URL e
// que o valor associado a essa chave seja uma string

// export const env = envSchema.parse(process.env)
// verifica se as variavéis presentes no process.env
// atendem o esquema definido em envSchema
// se não atende, ele já da um erro direto

export const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error?.format())
  throw new Error('Invalid environment variables!')
}

export const env = _env.data

// ao inves de usar o parse direto(codigo comentado), podemos usar
// o safeParse, pois com o safeParse podemos criar nossas proprias
// mensagens de erro, tornado o codigo mais descritivo

// o safeParse gera um boolean "success", ou seja, true or false
// se estiver tudo ok, true, se nao, false. ai ali verificamos:
// se o success for false(deu erro), eu gero uma mensagem de erro
// se deu certo, vai passar do if direto e a const env vai ter o conteudo
// de _env.data, que é o conteudo da minha .env
