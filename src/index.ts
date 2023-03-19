import 'reflect-metadata';
import { Container } from 'typedi';
import { Main } from './main';

Container.get(Main).run();
