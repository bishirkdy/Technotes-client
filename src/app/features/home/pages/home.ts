import { Component } from '@angular/core';
import { Navbar } from "../../../shared/components/navbar/navbar";
import { Hero } from "../components/hero/hero";
import { CategoryList } from "../components/category-list/category-list";
import { FeaturedNotes } from "../components/featured-notes/featured-notes";
import { RecentNotes } from "../components/recent-notes/recent-notes";
import { Footer } from "../../../shared/components/footer/footer";


@Component({
  selector: 'app-home',
  imports: [Navbar, Hero, CategoryList, FeaturedNotes, RecentNotes, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
