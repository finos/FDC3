/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import * as React from "react";
import { Button, DialogTitle, DialogActions, Dialog } from "@mui/material";

interface DialogModalProps {
	open: boolean;
	onClose: (value: boolean) => void;
	onAgree: (value: string) => void;
	selectedValue: any;
}

export function DialogModal(props: DialogModalProps) {
	const { onClose, onAgree, open, selectedValue } = props;

	const handleClose = () => {
		onClose(false);
	};

	const handleAgree = () => {
		onAgree(selectedValue?.id || "");
		onClose(false);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				{`Delete context example: ${selectedValue?.name || selectedValue?.id}`}
			</DialogTitle>
			<DialogActions>
				<Button onClick={handleClose}>Disagree</Button>
				<Button onClick={handleAgree} autoFocus>
					Agree
				</Button>
			</DialogActions>
		</Dialog>
	);
}
