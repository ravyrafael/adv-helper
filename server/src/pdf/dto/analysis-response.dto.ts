import { ApiProperty } from '@nestjs/swagger';

class MetadataDto {
  @ApiProperty({ example: 'INSS' })
  fonte: string;

  @ApiProperty({ example: 'Historico de Emprestimo Consignado' })
  documento: string;

  @ApiProperty({ example: '29/08/2025' })
  data_emissao: string;

  @ApiProperty({ example: '1/11' })
  pagina_inicial: string;

  @ApiProperty({ example: '' })
  observacoes: string;
}

class BeneficiarioDto {
  @ApiProperty({ example: 'João da Silva' })
  nome: string;

  @ApiProperty({ example: 'Aposentadoria por Idade' })
  beneficio: string;

  @ApiProperty({ example: '123456789' })
  numero_beneficio: string;

  @ApiProperty({ example: 'Ativo' })
  situacao: string;

  @ApiProperty({ example: '25/01/2024' })
  pago_em: string;

  @ApiProperty({ example: 'Depósito em Conta' })
  meio: string;

  @ApiProperty({ example: '1234' })
  agencia: string;

  @ApiProperty({ example: '12345-6' })
  conta_corrente: string;

  @ApiProperty({ example: '' })
  procurador: string;

  @ApiProperty({ example: '' })
  representante_legal: string;

  @ApiProperty({ example: 'Não' })
  pensao_alimenticia: string;

  @ApiProperty({ example: 'Sim' })
  liberado_para_emprestimo: string;

  @ApiProperty({ example: 'Sim' })
  elegivel: string;
}

class QuantitativoEmprestimosDto {
  @ApiProperty({ example: 2 })
  ativos: number;

  @ApiProperty({ example: 0 })
  suspensos: number;

  @ApiProperty({ example: 0 })
  reservados_portabilidade: number;

  @ApiProperty({ example: 0 })
  reservados_refinanciamento: number;
}

class ValoresBeneficioDto {
  @ApiProperty({ example: 'R$ 1.500,00' })
  base_calculo: string;

  @ApiProperty({ example: 'R$ 525,00' })
  max_comprometimento_permitido: string;

  @ApiProperty({ example: 'R$ 300,00' })
  total_comprometido: string;

  @ApiProperty({ example: 'R$ 0,00' })
  margem_extrapolada: string;
}

class MargemModalidadeDto {
  @ApiProperty({ example: 'R$ 450,00' })
  margem_consignavel: string;

  @ApiProperty({ example: 'R$ 300,00' })
  margem_utilizada: string;

  @ApiProperty({ example: 'R$ 0,00' })
  margem_reservada: string;

  @ApiProperty({ example: 'R$ 150,00' })
  margem_disponivel: string;

  @ApiProperty({ example: 'R$ 0,00' })
  margem_extrapolada: string;
}

class ValoresPorModalidadeDto {
  @ApiProperty({ type: MargemModalidadeDto })
  emprestimos: MargemModalidadeDto;

  @ApiProperty({ type: MargemModalidadeDto })
  rmc: MargemModalidadeDto;

  @ApiProperty({ type: MargemModalidadeDto })
  rcc: MargemModalidadeDto;
}

class MargemDto {
  @ApiProperty({ type: ValoresBeneficioDto })
  valores_beneficio: ValoresBeneficioDto;

  @ApiProperty({ type: ValoresPorModalidadeDto })
  valores_por_modalidade: ValoresPorModalidadeDto;
}

class ContratoAtivoDto {
  @ApiProperty({ example: '123456789' })
  contrato: string;

  @ApiProperty({ example: 'Banco do Brasil' })
  banco: string;

  @ApiProperty({ example: 'Ativo' })
  situacao: string;

  @ApiProperty({ example: 'Portal' })
  origem_averbacao: string;

  @ApiProperty({ example: '15/01/2024' })
  data_inclusao: string;

  @ApiProperty({ example: '25/01/2024' })
  inicio_desconto: string;

  @ApiProperty({ example: '25/12/2026' })
  fim_desconto: string;

  @ApiProperty({ example: '36' })
  qtd_parcelas: string;

  @ApiProperty({ example: 'R$ 150,00' })
  parcela: string;

  @ApiProperty({ example: 'R$ 5.000,00' })
  emprestado: string;

  @ApiProperty({ example: 'R$ 4.500,00' })
  liberado: string;

  @ApiProperty({ example: 'R$ 200,00' })
  iof: string;

  @ApiProperty({ example: '2,50%' })
  cet_mensal: string;

  @ApiProperty({ example: '30,00%' })
  cet_anual: string;

  @ApiProperty({ example: '2,00%' })
  taxa_juros_mensal: string;

  @ApiProperty({ example: '24,00%' })
  taxa_juros_anual: string;

  @ApiProperty({ example: 'R$ 1.200,00' })
  valor_pago: string;

  @ApiProperty({ example: '25/01/2024' })
  primeiro_desconto: string;

  @ApiProperty({ example: '' })
  suspensao_banco: string;

  @ApiProperty({ example: '' })
  suspensao_inss: string;

  @ApiProperty({ example: '' })
  reativacao_banco: string;

  @ApiProperty({ example: '' })
  reativacao_inss: string;
}

class ContratoExcluidoDto extends ContratoAtivoDto {
  @ApiProperty({ example: '15/01/2025' })
  data_exclusao: string;

  @ApiProperty({ example: 'Portal' })
  origem_da_exclusao: string;

  @ApiProperty({ example: 'Quitação antecipada' })
  motivo_da_exclusao: string;
}

class EmprestimosBancariosDto {
  @ApiProperty({ type: [ContratoAtivoDto] })
  contratos_ativos_e_suspensos: ContratoAtivoDto[];

  @ApiProperty({ type: [ContratoExcluidoDto] })
  contratos_excluidos_e_encerrados: ContratoExcluidoDto[];
}

class ContratoCartaoAtivoDto {
  @ApiProperty({ example: '123456789' })
  contrato: string;

  @ApiProperty({ example: 'RMC' })
  tipo: string;

  @ApiProperty({ example: 'Banco do Brasil' })
  banco: string;

  @ApiProperty({ example: 'Ativo' })
  situacao: string;

  @ApiProperty({ example: 'Portal' })
  origem_averbacao: string;

  @ApiProperty({ example: '15/01/2024' })
  data_inclusao: string;

  @ApiProperty({ example: 'R$ 1.000,00' })
  limite_cartao: string;

  @ApiProperty({ example: 'R$ 500,00' })
  reservado_atualizado: string;

  @ApiProperty({ example: '' })
  suspensao_banco: string;

  @ApiProperty({ example: '' })
  suspensao_inss: string;

  @ApiProperty({ example: '' })
  reativacao_banco: string;

  @ApiProperty({ example: '' })
  reativacao_inss: string;
}

class DescontoCartaoDto {
  @ApiProperty({ example: '123456789' })
  contrato: string;

  @ApiProperty({ example: 'RMC' })
  tipo: string;

  @ApiProperty({ example: 'Banco do Brasil' })
  banco: string;

  @ApiProperty({ example: 'Ativo' })
  situacao: string;

  @ApiProperty({ example: '01/2024' })
  competencia: string;

  @ApiProperty({ example: 'R$ 800,00' })
  saldo_devedor: string;

  @ApiProperty({ example: 'R$ 150,00' })
  desconto: string;

  @ApiProperty({ example: 'R$ 200,00' })
  utilizado_no_mes: string;

  @ApiProperty({ example: 'R$ 5,00' })
  iof: string;

  @ApiProperty({ example: '2,50%' })
  cet_mensal: string;

  @ApiProperty({ example: '30,00%' })
  cet_anual: string;

  @ApiProperty({ example: '2,00%' })
  taxa_juros_mensal: string;

  @ApiProperty({ example: '24,00%' })
  taxa_juros_anual: string;
}

class CartaoCreditoDto {
  @ApiProperty({ type: [ContratoCartaoAtivoDto] })
  contratos_ativos_e_suspensos: ContratoCartaoAtivoDto[];

  @ApiProperty({ type: [DescontoCartaoDto] })
  descontos_de_cartao: DescontoCartaoDto[];
}

export class AnalysisResponseDto {
  @ApiProperty({ type: MetadataDto })
  metadata: MetadataDto;

  @ApiProperty({ type: BeneficiarioDto })
  beneficiario: BeneficiarioDto;

  @ApiProperty({ type: QuantitativoEmprestimosDto })
  quantitativo_emprestimos: QuantitativoEmprestimosDto;

  @ApiProperty({ type: MargemDto })
  margem: MargemDto;

  @ApiProperty({ type: EmprestimosBancariosDto })
  emprestimos_bancarios: EmprestimosBancariosDto;

  @ApiProperty({ type: CartaoCreditoDto })
  cartao_de_credito: CartaoCreditoDto;
}

export class ContractAnalysisResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Análise de contrato concluída com sucesso' })
  message: string;

  @ApiProperty({
    example:
      'ac3df69e-f171-462d-8b71-fc099ef72d2e_extrato_emprestimo_consignado_completo_260324',
  })
  conversionId: string;

  @ApiProperty({ type: AnalysisResponseDto })
  analysis: AnalysisResponseDto;

  @ApiProperty({ example: 11 })
  totalImages: number;

  @ApiProperty({ example: '2025-08-29T17:20:15.352Z' })
  timestamp: string;
}
