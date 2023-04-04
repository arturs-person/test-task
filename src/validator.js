const allowedCharacters = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  '0'
];

const EMPTY_SPACE_CHAR = '0';

const MSG_ERR_NOT_VALID = 'Sudoku is invalid.';
const MSG_VALID_INCOMPLETE = 'Sudoku is valid but incomplete.';
const MSG_VALID = 'Sudoku is valid.';

class Validator {
  static validate(sudoku) {
    const validator = new Validator

    return validator.validate(sudoku)
  }

  constructor() {
    this.filled = true;
    this.valid = true;
  }

  parse(sudoku) {
    const parsed = sudoku
      .split('\r\n')
      .reduce((acc, item) => {
        if (item[0] !== '-') {
          const line = item.split('|')
            .map(element => element.split(' ').filter(entry => entry !== ''))
            .reduce((acc, item) => {
              return [...acc, ...item];
            }, []);

          acc.push(line);
        }

        return acc;
      }, []);

    return parsed;
  }

  isAllowedCharacters(collection) {
    return collection.findIndex(item => !allowedCharacters.includes(item));
  }

  isUnique(collection) {
    // filtering out 0's as there can be duplicates
    const uniqueCollection = collection.reduce((col, item) => {
      if (item !== EMPTY_SPACE_CHAR) {
        col.push(item);
      }

      return col;
    }, []);

    return new Set(uniqueCollection).size == uniqueCollection.length;
  }

  isFilled(collection) {
    const index = collection.findIndex(element =>  element == EMPTY_SPACE_CHAR);

    return index === -1;
  }

  validateGrid(data) {
    /** row validation */
    data.map((row) => {
      if (!this.isAllowedCharacters(row)) {
        this.valid = false;
      }

      if (!this.isFilled(row)) {
        this.filled = false;
      }

      if (!this.isUnique(row)) {
        this.valid = false;
      }
    });

    /** column validation */
    const columns = this.prepareColumns(data);

    columns.map((column) => {
      if (!this.isUnique(column)) {
        this.valid = false;
      }
    });
  }

  prepareColumns(data) {
    return data.reduce((collection, row, index) => {
      row.map((item, rowIndex) => {
        if (collection[rowIndex] === undefined) {
          collection.push([]);
        }
       
        collection[rowIndex][index] = item;
      });

      return collection;
    }, []);
  }

  prepareBlocks(data) {
    const blockSize = 3;
    let carrier = 0;

    const blocks = data.reduce((collection, row, index) => {
      for (let i = 0; i < blockSize; i++) {
        if (collection[(carrier * blockSize) + i] === undefined) {
          collection.push([]);
        }

        collection[(carrier * blockSize) + i] = collection[(carrier * blockSize) + i].concat(row.slice(i * blockSize, (i+1) * blockSize));
      }

      if ((index + 1) / blockSize === (carrier + 1)) {
        carrier++;
      }
      
      return collection;
      
    }, []);

    return blocks;
  }

  validateBlock(block) {
    if (!this.isUnique(block)) {
      this.valid = false;
    }
  }

  process(data) {
      /** Validate full grid 9x9 */
      this.validateGrid(data);

      /** validate groups */
      const blocks = this.prepareBlocks(data);
      blocks.map(block => this.validateBlock(block));
  }

  validate(sudoku) {
    const parsed = this.parse(sudoku);
    this.process(parsed);
    let message = MSG_ERR_NOT_VALID;

    if (this.valid && this.filled) {
      message = MSG_VALID;
    } else if(this.valid && !this.filled) {
      message = MSG_VALID_INCOMPLETE;
    }

    return message;
  }
}

module.exports = Validator
