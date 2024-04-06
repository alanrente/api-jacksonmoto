import { exit } from "process";
import * as readline from "readline/promises";
import Files from "./files";

/*
 * FLUXO
 * Cria arquivos .controller.ts, .service.ts e .router.ts(model não implementado)
 * Inclui route criado no index da pasta routes abaixo do ultimo routes.use
 * Inclui import no index da pasta routes abaixo do ultimo import
 *
 */

async function cli() {
  console.log("Executando...");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const resposta = await rl.question("Qual é o nome do recurso?\n");

    if (!resposta || resposta == "\r\n") {
      throw new Error(`Recurso ${resposta} inválido!`);
    }

    const files = new Files(resposta);
    const recurso = files.getRecurso;

    console.log(`seu recurso é ${recurso}`);

    const respostaCriar = await rl.question(
      "Podemos começar a criar o recurso?\n(s-sim/n-não): "
    );

    const respostasAceitas = ["n", "s"];
    if (!respostasAceitas.includes(respostaCriar)) {
      throw new Error(`Entrada ${respostaCriar} inválida!`);
    }

    if (respostaCriar === "n") {
      console.log(`Você selecionou não. Cancelando o processo...`);
      exit(0);
    }

    files.createFiles();

    console.log(`Finalizando...`);
    exit(0);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
cli();
