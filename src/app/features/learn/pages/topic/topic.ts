import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DummyDataService } from '../../../../core/data/dummy-data.service';
@Component({selector:'app-topic',imports:[RouterLink],templateUrl:'./topic.html',styleUrl:'./topic.css'}) export class Topic { topic:any; constructor(route:ActivatedRoute,public data:DummyDataService){this.topic=data.getTopic(route.snapshot.paramMap.get('topic')||'csharp')||data.learning[0];} }
