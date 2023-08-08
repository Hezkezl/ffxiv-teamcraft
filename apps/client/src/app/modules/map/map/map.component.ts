import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapData } from '../map-data';
import { Observable, ReplaySubject } from 'rxjs';
import { MapService } from '../map.service';
import { switchMap } from 'rxjs/operators';
import { MapMarker } from '../map-marker';
import { Vector2 } from '@ffxiv-teamcraft/types';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {

  public unknownPosition = false;

  @Input()
  small = false;

  @Input()
  hideDbButton = false;

  @Input()
  aetheryteZIndex = 5;

  mapData$: Observable<MapData>;

  position: Vector2 = { x: 0, y: 0 };

  @Output()
  loaded: EventEmitter<void> = new EventEmitter<void>();

  private mapId$: ReplaySubject<number> = new ReplaySubject<number>();

  constructor(private mapService: MapService) {
  }

  private _mapId: number;

  public get mapId(): number {
    return this._mapId;
  }

  @Input()
  public set mapId(id: number) {
    this._mapId = id;
    this.mapId$.next(id);
  }

  _markers: MapMarker[] = [];

  get markers(): MapMarker[] {
    return this._markers;
  }

  @Input()
  set markers(markers: MapMarker[] | null) {
    if (markers) {
      this._markers = markers;
      this.unknownPosition = markers.every(marker => !marker.x && !marker.y);
    }
  }

  ngOnInit() {
    this.mapData$ = this.mapId$.pipe(
      switchMap(mapId => {
        return this.mapService.getMapById(mapId);
      })
    );
  }

  getMarkerStyle(map: MapData, marker: MapMarker, aetheryte = false): any {
    const positionPercents = this.mapService.getPositionPercentOnMap(map, marker);
    return {
      top: `${positionPercents.y}%`,
      left: `${positionPercents.x}%`,
      transform: 'translate(-50%, -50%);',
      'z-index': marker.zIndex || (aetheryte ? this.aetheryteZIndex : 5),
      ...(marker.additionalStyle || {})
    };
  }

  getRadiusStyle(map: MapData, marker: MapMarker): any {
    const positionPercents = this.mapService.getPositionPercentOnMap(map, marker);
    return {
      top: `${positionPercents.y}%`,
      left: `${positionPercents.x}%`,
      width: `${250 * marker.radius / (map.size_factor * 20.48)}%`,
      transform: 'translate(-50%, -50%);'
    };
  }

  getSubtitleStyle(map: MapData, marker: MapMarker, aetheryte = false): any {
    return {
      ...this.getMarkerStyle(map, marker, aetheryte),
      ...marker.subtitleStyle
    };
  }

  getIcon(type: number): string {
    return `./assets/icons/Aetheryte${type === 1 ? '_Shard' : ''}.png`;
  }

  trackByMarker(index: number, marker: MapMarker): string {
    return `${marker.x}:${marker.y}:${marker.iconType}`;
  }

}
