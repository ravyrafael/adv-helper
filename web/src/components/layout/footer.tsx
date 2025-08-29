import React from 'react';
import Link from 'next/link';
import { Scale, Shield, Lock, FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo e Descrição */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Scale className="h-8 w-8 text-primary-400" />
                <span className="text-xl font-bold">
                  Adv<span className="text-primary-400">Helper</span>
                </span>
              </div>
              <p className="text-secondary-300 mb-6 max-w-md">
                Plataforma de assistência jurídica que utiliza IA para analisar
                documentos PDF, identificar pontos críticos e acelerar a criação
                de petições.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">LGPD Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-400">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm">Dados Seguros</span>
                </div>
              </div>
            </div>

            {/* Produto */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Produto</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/upload"
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    Upload de PDF
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contracts"
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    Análise de Contratos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates"
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    Templates
                  </Link>
                </li>
                <li>
                  <Link
                    href="/documents"
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    Documentos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-secondary-300 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Política de Privacidade</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-secondary-300 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Termos de Uso</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lgpd"
                    className="text-secondary-300 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span>LGPD</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="text-secondary-300 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Segurança</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-secondary-800 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-secondary-400 text-sm">
              © 2024 AdvHelper. Todos os direitos reservados.
            </p>
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
              ⚠️ Revisão humana obrigatória
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
