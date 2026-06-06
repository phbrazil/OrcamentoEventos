import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';

interface Sheet {
  name: string;
  categoryDefs: ColDef[];
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
      categoryDefs: [
        {
          field: 'Alimentos e Bebidas',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
        {
          field: 'QTD',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
        {
          field: 'Valor',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
      ],
      rowData: [
        { 'Alimentos e Bebidas': 'Item 1', QTD: '1', Valor: '100' },
        { 'Alimentos e Bebidas': 'Item 2', QTD: '2', Valor: '200' },
      ],
    },
    {
      name: 'Pré Evento',
      categoryDefs: [
        {
          field: 'Cenografia',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
        {
          field: 'QTD',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
        {
          field: 'Valor',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
      ],
      rowData: [
        { Cenografia: 'Decoração', QTD: '1', Valor: '150' },
        { Cenografia: 'Balões', QTD: '2', Valor: '80' },
      ],
    },
    {
      name: 'Pós Evento',
      categoryDefs: [
        {
          field: 'Aereo',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
        {
          field: 'QTD',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
        {
          field: 'Valor',
          editable: true,
          cellStyle: this.highlightCellIfGreaterThan100.bind(this),
        },
      ],
      rowData: [
        { Aereo: 'Passagem', QTD: '1', Valor: '220' },
        { Aereo: 'Bagagem', QTD: '2', Valor: '40' },
      ],
    },
  ];

  categoryOptions = [
    'Alimentos e Bebidas',
    'Aéreo',
    'Brindes',
    'Cenografia',
    'Comunicação Visual',
    'Decoração',
    'Equipamentos Audiovisuais',
    'Estrutura',
    'Fotografia',
    'Hotel',
    'Hospedagem',
    'Iluminação',
    'Infraestrutura',
    'Locação de Espaço',
    'Marketing',
    'Mobiliário',
    'Produção',
    'Recepção',
    'Segurança',
    'Serviços',
    'Sonorização',
    'Staff',
    'Tecnologia',
    'Transfer',
    'Transporte',
    'Tradução e Interpretação',
    'Uniformes',
    'Vídeo',
  ];

  selectedSheetIndex = 0;
  isNewCategoryModalOpen = false;
  newCategoryName = '';
  newCategoryError = '';

  addRow(sheet: Sheet) {
    const newRow: any = {};

    sheet.categoryDefs.forEach((col) => {
      if (col.field) {
        newRow[col.field] = '';
      }
    });

    sheet.rowData = [...sheet.rowData, newRow];
  }

  openNewCategoryModal(index: number) {
    this.selectedSheetIndex = index;
    this.newCategoryName = this.categoryOptions[0] || '';
    this.newCategoryError = '';
    this.isNewCategoryModalOpen = true;
  }

  closeNewCategoryModal() {
    this.isNewCategoryModalOpen = false;
    this.newCategoryName = '';
    this.newCategoryError = '';
  }

  confirmNewCategory() {
    const categoryName = this.newCategoryName.trim();
    const sheet = this.sheets[this.selectedSheetIndex];

    if (!categoryName) {
      this.newCategoryError = 'Informe um nome de categoria.';
      return;
    }

    const nameAlreadyUsed = sheet.categoryDefs.some(
      (col) =>
        col.field?.toString().toLowerCase() === categoryName.toLowerCase(),
    );

    if (nameAlreadyUsed) {
      this.newCategoryError = 'Já existe uma categoria com este nome!';
      return;
    }

    this.addCategory(sheet, categoryName);
    this.closeNewCategoryModal();
  }

  addCategory(sheet: Sheet, categoryName: string) {
    // Do not add a new column. Instead, append a header/divider row
    // Place the category name in the first existing column so it is visible
    const headerRow: any = {};

    if (sheet.categoryDefs.length > 0) {
      const firstField = sheet.categoryDefs[0].field?.toString() || '';
      sheet.categoryDefs.forEach((col) => {
        if (col.field) {
          headerRow[col.field.toString()] =
            col.field === firstField ? categoryName : '';
        }
      });
    } else {
      // no columns exist: put the category into a special property so it's still trackable
      headerRow.__category = categoryName;
    }

    headerRow.__isHeader = true;

    // Append header row after existing rows
    sheet.rowData = [...sheet.rowData, headerRow];
  }

  highlightCellIfGreaterThan100(params: any) {
    // Render header rows with a distinct style
    if (params && params.data && params.data.__isHeader) {
      return {
        backgroundColor: '#f3f6fb',
        color: '#1f5a2d',
        fontWeight: '700',
      };
    }

    const value = Number(params.value);
    if (!Number.isNaN(value) && value > 100) {
      return {
        backgroundColor: '#e5f7e5',
        color: '#1b5e20',
        fontWeight: '400',
      };
    } else {
      return {
        backgroundColor: '#fff',
        color: '#000',
        fontWeight: '400',
      };
    }
  }

  deleteCategoryDef(sheet: Sheet) {
    if (sheet.categoryDefs.length === 0) return;

    const lastCol = sheet.categoryDefs[sheet.categoryDefs.length - 1];
    sheet.categoryDefs = sheet.categoryDefs.slice(0, -1);

    sheet.rowData = sheet.rowData.map((row) => {
      const { [lastCol.field!]: _, ...rest } = row;
      return rest;
    });
  }

  // Remove the last header/category row that was appended
  deleteCategory(sheet: Sheet) {
    for (let i = sheet.rowData.length - 1; i >= 0; i--) {
      const row = sheet.rowData[i];
      if (row && (row['__isHeader'] || row['__category'])) {
        sheet.rowData = [
          ...sheet.rowData.slice(0, i),
          ...sheet.rowData.slice(i + 1),
        ];
        return;
      }
    }
  }

  deleteRow(sheet: Sheet) {
    if (sheet.rowData.length === 0) return;

    sheet.rowData = sheet.rowData.slice(0, -1);
  }
}
