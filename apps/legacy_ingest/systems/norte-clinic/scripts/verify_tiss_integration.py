import sys
import os
import logging
from unittest.mock import MagicMock, patch

# Add the project root to the python path so we can import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("TISS_VERIFICATION")

try:
    from app.services.tiss_integration import TissIntegrationService
except ImportError as e:
    logger.error(f"Failed to import TissIntegrationService: {e}")
    sys.exit(1)

def verify_tiss_mapping():
    logger.info("--- Starting Verification of TISS Integration ---")
    
    # Mock data representing a guide from the database
    mock_guide_data = {
        'carteira_beneficiario': '1234567890',
        'nome_beneficiario': 'John Doe',
        'codigo_tuss': '10101012',
        'descricao_procedimento': 'Consulta Medica',
        'registro_ans_operadora': '326305',
        'numero_guia_prestador': '20230001'
    }

    # 1. Initialize Service (Mocking Zeep Client to avoid real network/WSDL parsing issues during simple test)
    logger.info("1. Initializing Service...")
    with patch('app.services.tiss_integration.Client') as MockClient:
        # Check if WSDL file exists before proceeding, just to be sure
        wsdl_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'app', 'schemas', 'tiss_v4_01_00.wsdl')
        if not os.path.exists(wsdl_path):
             logger.error(f"WSDL file not found at: {wsdl_path}")
             return

        service = TissIntegrationService(wsdl_path=wsdl_path)
        
        # Mocking the type factory for object creation
        mock_factory = MagicMock()
        service.client.type_factory.return_value = mock_factory
        
        # 2. Test Mapping
        logger.info("2. Testing JSON -> XML Object Mapping...")
        xml_obj = service.map_guide_to_xml(mock_guide_data)
        
        # Verify calls to factory
        mock_factory.loteGuias.assert_called_once()
        logger.info("   [SUCCESS] Data mapped to Zeep Object successfully.")

        # 3. Test Sending Request (Mocked)
        logger.info("3. Testing SOAP Request (Mocked Success)...")
        
        # Mock the service operation response
        mock_response_success = MagicMock()
        mock_response_success.situacaoAutorizacao = 'AUTORIZADO'
        mock_response_success.senhaAutorizacao = 'AUTH-12345'
        
        service.service.tissSolicitacaoProcedimento_Operation.return_value = mock_response_success
        
        response = service.send_request(xml_obj)
        
        if response['success'] and response['authorization_password'] == 'AUTH-12345':
             logger.info(f"   [SUCCESS] Received 'AUTORIZADO' with password: {response['authorization_password']}")
        else:
             logger.error(f"   [FAILURE] Detailed response: {response}")

        # 4. Test Error Handling (Mocked Glosa)
        logger.info("4. Testing SOAP Request (Mocked Glosa)...")
        
        mock_response_glosa = MagicMock()
        mock_response_glosa.situacaoAutorizacao = 'GLOSA'
        mock_response_glosa.motivoGlosa = '1302 - Pendencia Admin'
        
        service.service.tissSolicitacaoProcedimento_Operation.return_value = mock_response_glosa
        
        response = service.send_request(xml_obj)
        
        if not response['success'] and response['denial_reason'] == '1302 - Pendencia Admin':
             logger.info(f"   [SUCCESS] Correctly handled glosa: {response['denial_reason']}")
        else:
             logger.error(f"   [FAILURE] Failed to handle glosa correctly. Response: {response}")

if __name__ == "__main__":
    verify_tiss_mapping()
