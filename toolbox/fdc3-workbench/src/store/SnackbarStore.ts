/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { makeObservable, observable, action } from 'mobx';
import { Color } from '@material-ui/lab/Alert';
import { nanoid } from 'nanoid';

interface SnackbarData {
  message: string;
  type: Color;
}

interface SnackbarItem extends SnackbarData {
  id: string;
}

class SnackbarStore {
  snackbarData: SnackbarItem | null = null;

  constructor() {
    makeObservable(this, {
      snackbarData: observable,
      setSnackbar: action,
      clearSnackbarData: action,
    });
  }

  setSnackbar(data: SnackbarData) {
    this.snackbarData = { ...data, id: nanoid() };
  }

  clearSnackbarData() {
    this.snackbarData = null;
  }
}

const snackbarStore = new SnackbarStore();

export default snackbarStore;
