import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectsSectionComponent } from '../../components/projects-section/projects-section.component';
import { ProjectsHeaderComponent } from '../../components/projects-header/projects-header.component';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectsSectionComponent, ProjectsHeaderComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
