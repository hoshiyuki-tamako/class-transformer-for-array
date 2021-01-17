import { ClassTransformerForArrayError, plainMapValue, UnknownClassError } from '../src';
import { TypeError } from '../src/common-errors';

try {
  // class not registered
  plainMapValue(Object, [12, 'the title']);
} catch (e) {
  if (e instanceof UnknownClassError) {
    console.error(e.message);
  }
  // catch all error from this library ( does not include common-errors )
  if (e instanceof ClassTransformerForArrayError) {
    console.error(e.message);
  }
}

try {
  // cannot pass null
  plainMapValue(Object, null as never);
} catch (e) {
  // type error
  if (e instanceof TypeError) {
    console.error(e.message);
  }
}
