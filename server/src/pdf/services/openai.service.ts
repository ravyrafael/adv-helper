import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

export interface ContractData {
  metadata: {
    fonte: string;
    documento: string;
    data_emissao: string;
    pagina_inicial: string;
    observacoes: string;
  };
  beneficiario: {
    nome: string;
    beneficio: string;
    numero_beneficio: string;
    situacao: string;
    pago_em: string;
    meio: string;
    agencia: string;
    conta_corrente: string;
    procurador: string;
    representante_legal: string;
    pensao_alimenticia: string;
    liberado_para_emprestimo: string;
    elegivel: string;
  };
  quantitativo_emprestimos: {
    ativos: number;
    suspensos: number;
    reservados_portabilidade: number;
    reservados_refinanciamento: number;
  };
  margem: {
    valores_beneficio: {
      base_calculo: string;
      max_comprometimento_permitido: string;
      total_comprometido: string;
      margem_extrapolada: string;
    };
    valores_por_modalidade: {
      emprestimos: {
        margem_consignavel: string;
        margem_utilizada: string;
        margem_reservada: string;
        margem_disponivel: string;
        margem_extrapolada: string;
      };
      rmc: {
        margem_consignavel: string;
        margem_utilizada: string;
        margem_reservada: string;
        margem_disponivel: string;
        margem_extrapolada: string;
      };
      rcc: {
        margem_consignavel: string;
        margem_utilizada: string;
        margem_reservada: string;
        margem_disponivel: string;
        margem_extrapolada: string;
      };
    };
  };
  emprestimos_bancarios: {
    contratos_ativos_e_suspensos: Array<{
      contrato: string;
      banco: string;
      situacao: string;
      origem_averbacao: string;
      data_inclusao: string;
      inicio_desconto: string;
      fim_desconto: string;
      qtd_parcelas: string;
      parcela: string;
      emprestado: string;
      liberado: string;
      iof: string;
      cet_mensal: string;
      cet_anual: string;
      taxa_juros_mensal: string;
      taxa_juros_anual: string;
      valor_pago: string;
      primeiro_desconto: string;
      suspensao_banco: string;
      suspensao_inss: string;
      reativacao_banco: string;
      reativacao_inss: string;
    }>;
    contratos_excluidos_e_encerrados: Array<{
      contrato: string;
      banco: string;
      situacao: string;
      origem_averbacao: string;
      data_inclusao: string;
      inicio_desconto: string;
      fim_desconto: string;
      qtd_parcelas: string;
      parcela: string;
      emprestado: string;
      liberado: string;
      iof: string;
      cet_mensal: string;
      cet_anual: string;
      taxa_juros_mensal: string;
      taxa_juros_anual: string;
      valor_pago: string;
      primeiro_desconto: string;
      suspensao_banco: string;
      suspensao_inss: string;
      reativacao_banco: string;
      reativacao_inss: string;
      data_exclusao: string;
      origem_da_exclusao: string;
      motivo_da_exclusao: string;
    }>;
  };
  cartao_de_credito: {
    contratos_ativos_e_suspensos: Array<{
      contrato: string;
      tipo: string;
      banco: string;
      situacao: string;
      origem_averbacao: string;
      data_inclusao: string;
      limite_cartao: string;
      reservado_atualizado: string;
      suspensao_banco: string;
      suspensao_inss: string;
      reativacao_banco: string;
      reativacao_inss: string;
    }>;
    descontos_de_cartao: Array<{
      contrato: string;
      tipo: string;
      banco: string;
      situacao: string;
      competencia: string;
      saldo_devedor: string;
      desconto: string;
      utilizado_no_mes: string;
      iof: string;
      cet_mensal: string;
      cet_anual: string;
      taxa_juros_mensal: string;
      taxa_juros_anual: string;
    }>;
  };
}

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      this.logger.warn(
        'OPENAI_API_KEY não configurada - funcionalidade de análise desabilitada',
      );
    } else {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  async analyzeContractImages(imagePaths: string[]): Promise<ContractData> {
    if (!this.openai) {
      throw new Error('OpenAI API não configurada');
    }

    // Determinar diretório de cache baseado no primeiro caminho de imagem
    const outputDir = path.dirname(imagePaths[0]);
    const cacheFilePath = path.join(outputDir, 'analysis_cache.json');

    this.logger.log(
      `Iniciando análise de ${imagePaths.length} imagens (uma por vez)`,
    );

    // Verificar se já existe cache
    let cacheData: any = null;
    if (fs.existsSync(cacheFilePath)) {
      try {
        const cacheContent = fs.readFileSync(cacheFilePath, 'utf8');
        cacheData = JSON.parse(cacheContent);

        // Verificar se análise já foi completada
        if (cacheData.completed && cacheData.totalPages === imagePaths.length) {
          this.logger.log('Análise já concluída, retornando cache');
          return cacheData.result;
        }

        this.logger.log(
          `Cache encontrado: ${cacheData.processedPages?.length || 0} páginas já processadas`,
        );
      } catch (error) {
        this.logger.warn('Erro ao ler cache, reiniciando análise:', error);
        cacheData = null;
      }
    }

    try {
      // Inicializar dados extraídos (do cache ou novo)
      const allExtractedData: any[] = cacheData?.extractedData || [];
      const processedPages: number[] = cacheData?.processedPages || [];

      for (let i = 0; i < imagePaths.length; i++) {
        const pageNumber = i + 1;

        // Pular se página já foi processada
        if (processedPages.includes(pageNumber)) {
          this.logger.debug(`Página ${pageNumber} já processada, pulando`);
          continue;
        }

        const imagePath = imagePaths[i];
        this.logger.log(
          `Processando imagem ${pageNumber}/${imagePaths.length}: ${path.basename(imagePath)}`,
        );

        const fullPath = path.resolve(imagePath);
        const imageBuffer = fs.readFileSync(fullPath);
        const base64Image = imageBuffer.toString('base64');

        const imageContent = {
          type: 'image_url' as const,
          image_url: {
            url: `data:image/png;base64,${base64Image}`,
            detail: 'high' as const,
          },
        };

        const prompt = `Extraia TODOS os dados visíveis desta imagem e retorne APENAS um JSON válido.
Se não houver dados relevantes, retorne {"dados": "nenhum"}.

Formato esperado:
- Dados de beneficiário
- Informações de margem
- Contratos (ativos, suspensos, excluídos)
- Dados de cartão de crédito
- Qualquer outra informação visível

Retorne APENAS JSON sem texto adicional:`;

        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content:
                'Você é um extrator de dados especializado. Retorne APENAS JSON válido, sem texto adicional.',
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt,
                },
                imageContent,
              ],
            },
          ],
          max_tokens: 4000,
          temperature: 0,
          response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          this.logger.warn(`Resposta vazia para imagem ${pageNumber}`);
          processedPages.push(pageNumber);
          this.saveCache(
            cacheFilePath,
            allExtractedData,
            processedPages,
            imagePaths.length,
            false,
          );
          continue;
        }

        this.logger.debug(`Processando resposta da imagem ${pageNumber}`);

        // Parse do JSON
        try {
          let jsonStr = content.trim();

          // Limpeza básica
          if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7);
          }
          if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.slice(3);
          }
          if (jsonStr.endsWith('```')) {
            jsonStr = jsonStr.slice(0, -3);
          }

          const firstBrace = jsonStr.indexOf('{');
          const lastBrace = jsonStr.lastIndexOf('}');
          if (firstBrace >= 0 && lastBrace > firstBrace) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
          }

          const parsedData = JSON.parse(jsonStr);

          // Só adicionar se contém dados relevantes
          if (
            parsedData &&
            typeof parsedData === 'object' &&
            parsedData.dados !== 'nenhum'
          ) {
            allExtractedData.push({
              page: pageNumber,
              data: parsedData,
            });
            this.logger.log(`Dados extraídos da imagem ${pageNumber}`);
          } else {
            this.logger.debug(`Nenhum dado relevante na imagem ${pageNumber}`);
          }

          // Marcar página como processada
          processedPages.push(pageNumber);

          // Salvar cache após cada página processada
          this.saveCache(
            cacheFilePath,
            allExtractedData,
            processedPages,
            imagePaths.length,
            false,
          );
        } catch (parseError) {
          this.logger.warn(
            `Erro ao processar imagem ${pageNumber}:`,
            parseError,
          );
          // Marcar como processada mesmo com erro para não tentar novamente
          processedPages.push(pageNumber);
          this.saveCache(
            cacheFilePath,
            allExtractedData,
            processedPages,
            imagePaths.length,
            false,
          );
        }
      }

      this.logger.log(
        `Processamento concluído. ${allExtractedData.length} imagens com dados`,
      );

      // Agrupar todos os dados extraídos
      const result = this.consolidateExtractedData(allExtractedData);

      // Salvar cache final com resultado consolidado
      this.saveCache(
        cacheFilePath,
        allExtractedData,
        processedPages,
        imagePaths.length,
        true,
        result,
      );

      return result;
    } catch (error) {
      this.logger.error('Erro na análise com OpenAI:', error);
      throw error;
    }
  }

  private saveCache(
    cacheFilePath: string,
    extractedData: any[],
    processedPages: number[],
    totalPages: number,
    completed: boolean,
    result?: ContractData,
  ): void {
    try {
      const cacheData = {
        timestamp: new Date().toISOString(),
        completed,
        totalPages,
        processedPages: processedPages.sort((a, b) => a - b),
        extractedData,
        result: completed ? result : null,
        metadata: {
          version: '1.0',
          totalExtracted: extractedData.length,
          progressPercent: Math.round(
            (processedPages.length / totalPages) * 100,
          ),
        },
      };

      fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2));
      this.logger.debug(
        `Cache salvo: ${processedPages.length}/${totalPages} páginas processadas`,
      );
    } catch (error) {
      this.logger.warn('Erro ao salvar cache:', error);
    }
  }

  private consolidateExtractedData(extractedData: any[]): any {
    this.logger.log('Agrupando dados extraídos sem mapeamento');

    // Consolidar dados dinamicamente, detectando todas as propriedades
    const result = {
      metadata: {
        fonte: 'INSS',
        documento: 'Historico de Emprestimo Consignado',
        total_paginas: extractedData.length,
        data_processamento: new Date().toISOString(),
      },
    };

    // Consolidar dados de todas as páginas dinamicamente
    for (const extracted of extractedData) {
      const pageData = extracted.data;

      // Iterar por todas as propriedades do pageData
      for (const [key, value] of Object.entries(pageData)) {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            // Se é array, concatenar
            if (!result[key]) {
              result[key] = [];
            }
            result[key].push(...value);
          } else {
            // Se não é array, substituir (pegar o último valor não nulo)
            result[key] = value;
          }
        }
      }
    }

    this.logger.log('Consolidação por tipo concluída');
    return result;
  }
}
