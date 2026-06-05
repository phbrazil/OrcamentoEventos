import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';

interface Sheet {
  name: string;
  columnDefs: ColDef[];
  rowData: { [key: string]: any }[];
}

@Component({
  selector: 'app-planilha',
  templateUrl: './planilha.component.html',
  styleUrls: ['./planilha.component.scss'],
})
export class PlanilhaComponent {
  sheets: Sheet[] = [
    {
      name: 'Orçamento',
      columnDefs: [
        {
          field: 'Alimentos e Bebidas',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
        {
          field: 'Hotel',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
      ],
      rowData: [
        { 'Alimentos e Bebidas': 'Item 1', Hotel: '100' },
        { 'Alimentos e Bebidas': 'Item 2', Hotel: '200' },
      ],
    },
    {
      name: 'Pré Evento',
      columnDefs: [
        {
          field: 'Cenografia',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
        {
          field: 'Hospedagem',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
      ],
      rowData: [
        { Cenografia: 'Decoração', Hospedagem: '150' },
        { Cenografia: 'Balões', Hospedagem: '80' },
      ],
    },
    {
      name: 'Pós Evento',
      columnDefs: [
        {
          field: 'Aereo',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
        {
          field: 'Serviços',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
      ],
      rowData: [
        { Aereo: 'Passagem', Serviços: '220' },
        { Aereo: 'Bagagem', Serviços: '40' },
      ],
    },
  ];

  columnOptions = [
    'Alimentos e Bebidas',
    'Cenografia',
    'Hotel',
    'Hospedagem',
    'Aereo',
    'Serviços',
  ];

  selectedSheetIndex = 0;
  isNewColumnModalOpen = false;
  newColumnName = '';
  newColumnError = '';

  addRow(sheet: Sheet) {
    const newRow: any = {};

    sheet.columnDefs.forEach((col) => {
      if (col.field) {
        newRow[col.field] = '';
      }
    });

    sheet.rowData = [...sheet.rowData, newRow];
  }

  openNewColumnModal(index: number) {
    this.selectedSheetIndex = index;
    this.newColumnName = this.columnOptions[0] || '';
    this.newColumnError = '';
    this.isNewColumnModalOpen = true;
  }

  closeNewColumnModal() {
    this.isNewColumnModalOpen = false;
    this.newColumnName = '';
    this.newColumnError = '';
  }

  confirmNewColumn() {
    const columnName = this.newColumnName.trim();
    const sheet = this.sheets[this.selectedSheetIndex];

    if (!columnName) {
      this.newColumnError = 'Informe um nome de coluna.';
      return;
    }

    const nameAlreadyUsed = sheet.columnDefs.some(
      (col) => col.field?.toString().toLowerCase() === columnName.toLowerCase(),
    );

    if (nameAlreadyUsed) {
      this.newColumnError = 'Já existe uma coluna com este nome!';
      return;
    }

    this.addColumn(sheet, columnName);
    this.closeNewColumnModal();
  }

  addColumn(sheet: Sheet, columnName: string) {
    sheet.columnDefs = [
      ...sheet.columnDefs,
      {
        field: columnName,
        headerName: columnName,
        editable: true,
        cellStyle: this.highlightCellIfGreaterThan100.bind(this),
      },
    ];

    sheet.rowData = sheet.rowData.map((row) => ({
      ...row,
      [columnName]: '',
    }));
  }

  highlightCellIfGreaterThan100(params: any) {
    const value = Number(params.value);
    if (!Number.isNaN(value) && value > 100) {
      return {
        backgroundColor: '#e5f7e5',
        color: '#1b5e20',
      };
    } else {
      return {
        backgroundColor: '#fff',
        color: '#000',
      };
    }
  }

  deleteColumn(sheet: Sheet) {
    if (sheet.columnDefs.length === 0) return;

    const lastCol = sheet.columnDefs[sheet.columnDefs.length - 1];
    sheet.columnDefs = sheet.columnDefs.slice(0, -1);

    sheet.rowData = sheet.rowData.map((row) => {
      const { [lastCol.field!]: _, ...rest } = row;
      return rest;
    });
  }

  deleteRow(sheet: Sheet) {
    if (sheet.rowData.length === 0) return;

    sheet.rowData = sheet.rowData.slice(0, -1);
  }
}
