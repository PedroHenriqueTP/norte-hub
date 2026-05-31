import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { THEME } from '../constants';

const LocationContact = () => {
    return (
        <section id="contact" className="py-24 bg-bakery-50">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid md:grid-cols-2 gap-12 rounded-3xl overflow-hidden bg-white shadow-xl">

                    {/* Map Placeholder */}
                    <div className="bg-bakery-200 h-[400px] md:h-full relative flex items-center justify-center">
                        {/* In a real project, Embed Google Maps Iframe here */}
                        <div className="text-center p-6 opacity-60">
                            <MapPin size={48} className="mx-auto mb-2 text-bakery-800" />
                            <p className="text-bakery-900 font-bold">Mapa do Google</p>
                            <p className="text-sm text-bakery-700">Rua das Flores, 123 - Centro</p>
                        </div>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975860273!2d-46.6521943!3d-23.5645229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1sen!2sbr!4v1614180000000!5m2!1sen!2sbr"
                            width="100%"
                            height="100%"
                            style={{ border: 0, position: 'absolute', inset: 0, opacity: 0.8, filter: 'grayscale(0.4) sepia(0.2)' }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Google Maps"
                        ></iframe>
                    </div>

                    {/* Contact Info */}
                    <div className="p-12 md:p-16 flex flex-col justify-center">
                        <span className="text-bakery-600 font-sans font-bold text-sm tracking-widest uppercase mb-4 block">
                            Visite-nos
                        </span>
                        <h2 className="text-4xl font-serif font-bold text-bakery-900 mb-8">
                            Estamos esperando por você.
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="text-bakery-500 mt-1" />
                                <div>
                                    <h4 className="font-bold text-bakery-900">Endereço</h4>
                                    <p className="text-bakery-700">Rua das Flores, 123 - Jardins, SP</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Clock className="text-bakery-500 mt-1" />
                                <div>
                                    <h4 className="font-bold text-bakery-900">Horário</h4>
                                    <p className="text-bakery-700">Seg - Sex: 07h às 20h</p>
                                    <p className="text-bakery-700">Sáb - Dom: 08h às 18h</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Phone className="text-bakery-500 mt-1" />
                                <div>
                                    <h4 className="font-bold text-bakery-900">Contato</h4>
                                    <p className="text-bakery-700">(11) 99999-8888</p>
                                </div>
                            </div>
                        </div>

                        <button className="mt-10 bg-bakery-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-bakery-800 transition-colors w-full md:w-auto">
                            Entrar em Contato
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default LocationContact;
