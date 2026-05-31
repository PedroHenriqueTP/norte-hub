from zeep import Client, Settings
from zeep.transports import Transport
from lxml import etree
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class TissIntegrationService:
    """
    Service to handle integration with Healthcare Operators using TISS Standard (SOAP/XML).
    """

    def __init__(self, wsdl_path: str = "app/schemas/tiss_v4_01_00.wsdl", endpoint_url: Optional[str] = None):
        """
        Initializes the TISS service with WSDL and optional endpoint.
        """
        self.wsdl_path = wsdl_path
        self.endpoint_url = endpoint_url
        
        # Zeep settings for strict XML handling
        settings = Settings(strict=False, xml_huge_tree=True)
        
        # Initialize Client (mock transport could be injected here for testing)
        try:
            self.client = Client(wsdl=self.wsdl_path, settings=settings)
            if self.endpoint_url:
                self.service = self.client.create_service(
                    '{http://www.ans.gov.br/tiss/ws/tipos/tissSolicitacaoProcedimento/v40100}tissSolicitacaoProcedimento_Binding',
                    self.endpoint_url
                )
            else:
                 # Fallback/Default service from WSDL
                self.service = self.client.service
        except Exception as e:
            logger.error(f"Failed to initialize Zeep Client: {e}")
            raise e

    def map_guide_to_xml(self, guide_data: Dict[str, Any]) -> Any:
        """
        Maps internal JSON guide data to TISS XML object using Zeep's factory.
        
        :param guide_data: Dictionary containing guide details (beneficiary, procedure, etc.)
        :return: Zeep object representing the 'loteGuias' element.
        """
        try:
            # Create object factories from WSDL types
            factory = self.client.type_factory('ns0') # ns0 is usually the target namespace alias in zeep

            # Construct the complex types
            dados_beneficiario = {
                'numeroCarteira': guide_data.get('carteira_beneficiario'),
                'nomeBeneficiario': guide_data.get('nome_beneficiario')
            }

            dados_procedimento = {
                'codigoTuss': guide_data.get('codigo_tuss'),
                'descricaoProcedimento': guide_data.get('descricao_procedimento')
            }
            
            guia = {
                'dadosBeneficiario': dados_beneficiario,
                'dadosProcedimento': dados_procedimento
            }
            
            cabecalho = {
                'registroANS': guide_data.get('registro_ans_operadora'),
                'numeroGuia': guide_data.get('numero_guia_prestador')
            }

            # Assemble the root element 'loteGuias'
            lote_guias = factory.loteGuias(
                cabecalho=cabecalho,
                guia=[guia] # 'guia' is maxOccurs="unbounded"
            )
            
            return lote_guias

        except Exception as e:
            logger.error(f"Error mapping data to XML: {e}")
            raise ValueError(f"Failed to map guide data: {e}")

    def send_request(self, lote_guias_xml_obj: Any) -> Dict[str, Any]:
        """
        Sends the SOAP request to the operator.
        
        :param lote_guias_xml_obj: The Zeep object for the request body.
        :return: Parsed response dictionary with status and authorization details.
        """
        try:
            # Send the request
            # In a real scenario, we might need to sign the XML here or attach WS-Security headers.
            response = self.service.tissSolicitacaoProcedimento_Operation(loteGuias=lote_guias_xml_obj)
            
            return self.handle_response(response)
            
        except Exception as e:
            logger.error(f"SOAP Request failed: {e}")
            # Depending on the error, we might implement retry logic here
            return {
                "success": False,
                "error": str(e)
            }

    def handle_response(self, response: Any) -> Dict[str, Any]:
        """
        Parses the SOAP response object into a standardized dictionary.
        
        :param response: Zeep response object.
        :return: Dict with 'status', 'authorization_pwd', 'error_code'.
        """
        # Zeep returns a python object, so we can access attributes directly
        # The WSDL defines: situacaoAutorizacao, senhaAutorizacao, motivoGlosa
        
        status = getattr(response, 'situacaoAutorizacao', 'UNKNOWN')
        
        result = {
            "success": False,
            "status_raw": status,
            "authorization_password": None,
            "denial_reason": None
        }

        if status == 'AUTORIZADO':
            result["success"] = True
            result["authorization_password"] = getattr(response, 'senhaAutorizacao', None)
        elif status == 'NEGADO' or status == 'GLOSA':
             result["denial_reason"] = getattr(response, 'motivoGlosa', 'Unknown Reason')
        else:
             result["denial_reason"] = f"Unexpected status: {status}"
             
        return result

    def generate_signed_xml(self, xml_obj):
        """
        Placeholder for XML Digital Signature (XMLDSig) logic.
        TISS standard often requires the SOAP Body or specific elements to be signed.
        """
        pass
