import {
  ActionNormalObject
} from '../../../core/type';
import {
  WebClientGlobalContext,
  WebClientLocalContext
} from "../../contexts/webClient/modelManager";

type CustomFuncType = (payload: object, globalContext: object, localContext: object) => Promise<object>;
interface TranslatorRetType {
  func: CustomFuncType
};

export function translator(func: CustomFuncType): ActionNormalObject<TranslatorRetType> {
  return {
    kind: 'ActionNormalObject',
    platform: 'webClient',
    type: 'deal',
    args: { func }
  };
}

export function executor({ func }: TranslatorRetType) {
  return async (payload: object, globalContext: WebClientGlobalContext, localContext: WebClientLocalContext) => {
    return await func.call(null, payload, globalContext, localContext);
  };
}