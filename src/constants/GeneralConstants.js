class GeneralConstants {

    ROLE_NAME_ADMIN = "admin";
    ROLE_NAME_MERCHANT = "Merchant";
    ROLE_NAME_CASHPOINT = "Cashpoint";
    ROLE_NAME_AH = "account_head";
    ROLE_NAME_NM = "Maxis-Collection-Nation-Manager";
    
    DMA_RESPONSE_SUCCESS_CODE = "201";
    DMA_RESPONSE_SUCCESS_RESULT = "Success";
    DMA_RESPONSE_SUCCESS_MESSAGE = "The lifting limit is adjusted";

    DMA_RESPONSE_FAILURE_CODE = "";
    DMA_RESPONSE_FAILURE_RESULT = "Failure";
    DMA_RESPONSE_FAILURE_MESSAGE = "Failed to adjust lifting limit";

    MW_RESPONSE_SUCCESS_CODE = "201";
    MW_RESPONSE_SUCCESS_RESULT = "Success";
    MW_RESPONSE_SUCCESS_MESSAGE = "The wallet is added";

    MW_RESPONSE_FAILURE_CODE = "";
    MW_RESPONSE_FAILURE_RESULT = "Failure";
    MW_RESPONSE_FAILURE_MESSAGE = "Failed to add wallet";
}

export default new GeneralConstants();