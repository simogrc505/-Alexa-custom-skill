// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const regioni = [['Piemonte', 'Torino'],['Lombardia', 'Milano'],['Veneto', 'Venezia'],['Liguria', 'Genova'],
    ['Calabria', 'Reggio Calabria'], ['Sicilia', 'Palermo'], ['Puglia', 'Bari'], ['Sardegna', 'Cagliari'],
    ['Toscana', 'Firenze'], ['Valle d Aosta', 'Aosta'], ['Trentino Alto Adige', 'Trento'], ['Friuli Venezia Giulia', 'Trieste'],
    ['Umbria', 'Perugia'], ['Marche', 'Ancona'], ['Abruzzo', 'L Aquila'], ['Molise', 'Campobasso'], ['Emilia Romagna', 'Bologna'], ['Basilicata', 'Potenza']]

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Ciao, vuoi giocare?';

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.score = 0;
        sessionAttributes.step = 0;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const ChiefTownIntentIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChiefTownIntent';
    },
    handle(handlerInput) {
        const regione = regioni[Math.floor(Math.random() * regioni.length)]
        const capoluogo = regione[1]

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.region = regione   //REGIONE

        const speakOutput = `Qual è il capoluogo di ${regione[0]}, tra ${capoluogo}, Roma, Napoli?`;
        sessionAttributes.step = sessionAttributes.step+1
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse()

    }
};
const AnswerChiefTownIntentIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerChiefTownIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const slot = handlerInput.requestEnvelope.request.intent.slots;
        const answerSlot = slot['capoluogo'].value.toLowerCase();
        let speechText = '';
        if(answerSlot === sessionAttributes.region[1].toLowerCase()){
            if(sessionAttributes.step === 5){
                speechText = `Corretto. Hai terminato la partita, il tuo punteggio è di ${sessionAttributes.score} punti. Vuoi ricominciare?`
                sessionAttributes.step = 0;
                sessionAttributes.score = 0;
            }
            else {
                sessionAttributes.score = sessionAttributes.score+1;
                speechText = 'Corretto, vuoi continuare?'
            }
        } else {                                                            //ELSE NON VIENE MAI CHIAMATO
            if(sessionAttributes.step === 5){
                speechText = `Non è corretto. Hai terminato la partita, il tuo punteggio è di ${sessionAttributes.score} punti. Vuoi ricominciare?`
                sessionAttributes.step = 0;
                sessionAttributes.score = 0;
            }else{
                sessionAttributes.score = sessionAttributes.score+0;
                speechText = 'Non è corretto, vuoi andare al prossimo turno?'
            }

        }
        // console.log(answerSlot , sessionAttributes.region[1].toLowerCase())
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse()
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ChiefTownIntentIntentHandler,
        AnswerChiefTownIntentIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
