import { Routes } from '@angular/router';
import { Home } from './features/home/pages/home';
import { NoteCreate } from './features/notes/pages/note-create/note-create';
import { MyNotes } from './features/notes/pages/my-notes/my-notes';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { ForgotPassword } from './features/auth/pages/forgot-password/forgot-password';
import { Register } from './features/auth/pages/register/register';
import { Login } from './features/auth/pages/login/login';
import { NoteView } from './features/notes/pages/note-view/note-view';
import { NoteList } from './features/notes/pages/note-list/note-list';
import { AppLayout } from './layout/app-layout/app-layout';
import { FavoriteList } from './features/favorites/pages/favorite-list/favorite-list';
import { SharedNotes } from './features/sharing/pages/shared-notes/shared-notes';
import { CategoryList } from './features/categories/pages/category-list/category-list';
import { TagList } from './features/tags/pages/tag-list/tag-list';
import { Profile } from './features/profile/pages/profile/profile';
import { LearnHome } from './features/learn/pages/learn-home/learn-home';
import { Topic } from './features/learn/pages/topic/topic';
import { Lesson } from './features/learn/pages/lesson/lesson';
import { Search } from './features/search/pages/search/search';
import { Activity } from './features/activity/pages/activity/activity';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'learn', component: LearnHome },
  { path: 'learn/:topic', component: Topic },
  { path: 'learn/:topic/:lesson', component: Lesson },
  { path: 'notes', component: NoteList },
  { path: 'notes/:id', component: NoteView },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },


  {
    path: 'app',
    component: AppLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'notes', component: MyNotes },
      { path: 'notes/create', component: NoteCreate },
      { path: 'favorites', component: FavoriteList },
      { path: 'shared', component: SharedNotes },
      { path: 'categories', component: CategoryList },
      { path: 'tags', component: TagList },
      { path: 'profile', component: Profile },
      { path: 'search', component: Search },
      { path: 'activity', component: Activity },
    ],
  },
  { path: '**', redirectTo: '' },
];
