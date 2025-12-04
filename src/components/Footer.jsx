import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, CreditCard, Shield, Truck } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo y Descripción */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {/* Logo - Cambia por tu logo */}
              <img 
                src="/images/logoGrafitiWhite.png" 
                alt="Logo" 
                className="h-16 w-auto" 
              />
            </div>
            <p className="text-gray-400 mb-4">
              Tu tienda de moda online con las mejores ofertas. 
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 border border-gray-700 rounded-full flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Métodos de Pago */}
          <div>
            <h3 className="text-lg font-bold mb-4">MÉTODOS DE PAGO</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <CreditCard className="w-5 h-5 text-white" />
                <span>Tarjetas de crédito/débito</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Shield className="w-5 h-5 text-white" />
                <span>PayPal</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Truck className="w-5 h-5 text-white" />
                <span>Contra reembolso</span>
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-4">ENLACES RÁPIDOS</h3>
            <div className="space-y-2">
              {[
                'Nuevos Productos',
                'Ofertas Especiales', 
                'Tops',
                'Bottoms',
                'Accesorios',
                'Colección Completa'
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-gray-400 hover:text-blue-700 transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-bold mb-4">CONTACTO</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-white" />
                <span>Dirección de la tienda</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-white" />
                <span>+34 900 000 000</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-white" />
                <span>info@tienda.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="grid md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-800">
          <div>
            <h4 className="font-bold mb-2">ENVÍOS RÁPIDOS</h4>
            <p className="text-gray-400 text-sm">
              Entrega en 24-48h en península. Envíos a todo el mundo.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2">DEVOLUCIONES</h4>
            <p className="text-gray-400 text-sm">
              14 días para devoluciones gratuitas. Fácil y sin complicaciones.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2">SEGURIDAD</h4>
            <p className="text-gray-400 text-sm">
              Compra 100% segura con cifrado SSL. Tus datos protegidos.
            </p>
          </div>
        </div>

        {/* Enlaces Legales */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              <p>&copy; {currentYear} HoloCrew. Todos los derechos reservados.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                'Términos y Condiciones',
                'Política de Privacidad', 
                'Política de Cookies',
                'Aviso Legal',
                'Condiciones de Venta'
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-gray-400 hover:text-blue-700 text-sm transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;