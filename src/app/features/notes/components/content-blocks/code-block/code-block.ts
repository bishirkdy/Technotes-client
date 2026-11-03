import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SQL_DIALECTS } from '../../../models/code-example.model';

@Component({
  selector: 'app-code-block',
  imports: [],
  templateUrl: './code-block.html',
  styleUrl: './code-block.css'
})
export class CodeBlock {

  readonly sqlDialects = SQL_DIALECTS;

  @Input()
  data: any = {};

  @Output()
  dataChange = new EventEmitter<any>();

  updateField(field: string, value: string | boolean): void {
    this.data = {
      ...this.data,
      [field]: value
    };

    this.dataChange.emit(this.data);
  }

  setLanguage(language: string): void {
    this.data = {
      ...this.data,
      language,
      ...(language === 'sql' && !this.data.dialect ? { dialect: 'sqlserver' } : {})
    };

    this.dataChange.emit(this.data);
  }
}