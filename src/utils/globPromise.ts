import glob from 'glob';
import { promisify } from 'util';

const globPromise = promisify(glob);

export default globPromise;