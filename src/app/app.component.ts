import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IndexeddbService } from 'src/app/services/indexeddb.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  employees: any[] = [];
  employeeName: string = '';
  employeeRole: string = '';
  toDate: string = '';
  endDate: string = '';
  developers: any = [
    {
      id: 0,
      name: 'Product Designer',
    },
    {
      id: 1,
      name: 'Flutter Developer',
    },
    {
      id: 1,
      name: 'Qa Tester',
    },
    {
      id: 1,
      name: 'Product Owner',
    },
  ];
  @ViewChild('secondDialog', { static: true }) secondDialog: TemplateRef<any>;
  constructor(private indexeddbService: IndexeddbService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.indexeddbService
      .getEmployees()
      .then((data: any[]) => {
        this.employees = data;
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
      });
  }

  addEmployee() {
    if (this.employeeName && this.employeeRole) {
      const employee = {
        name: this.employeeName,
        role: this.employeeRole,
        toDate:this.toDate,
        endDate: this.endDate
      };
      this.indexeddbService
        .addEmployee(employee)
        .then((id) => {
          console.log('Employee added with ID:', id);
          this.loadEmployees(); // Reload the employee list
          this.employeeName = '';
          this.employeeRole = '';
          this.toDate='';
          this.endDate='';
        })
        .catch((error) => {
          console.error('Error adding employee:', error);
        });
    } else {
      alert('Please fill in all fields');
    }
    this.dialog.closeAll();
  }

  deleteEmployee(id: number) {
    this.indexeddbService
      .deleteEmployee(id)
      .then(() => {
        console.log('Employee deleted');
        this.loadEmployees(); // Reload the employee list
      })
      .catch((error) => {
        console.error('Error deleting employee:', error);
      });
  }

  sourceChange(event: any) {
    debugger;
    this.employeeRole = event;
  }
  openDialogWithoutRef() {
    this.dialog.open(this.secondDialog);
  }
}
