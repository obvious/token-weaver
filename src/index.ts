import * as StyleDictionary from 'style-dictionary';
import {config} from './config';

function run() {
  try {
    StyleDictionary.extend(config).buildAllPlatforms();
  } catch (e) {
    console.log(e);
  }
}

run();
