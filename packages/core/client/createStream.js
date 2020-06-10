import {
  getGlobalState,
  setGlobalState,
  getState,
  setState,
  getModelList,
  createModel,
  destoryModel,
  evaluateModelAction
} from './stateManager';
import { getActionEvaluator } from './actionCreator';

import createStreamsFactory from '../lib/createStream';

export default createStreamsFactory(getActionEvaluator, {
  getGlobalState,
  setGlobalState,
  getState,
  setState,
  getModelList,
  createModel,
  destoryModel,
  evaluateModelAction
});
