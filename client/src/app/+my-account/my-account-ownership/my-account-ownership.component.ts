import { SortMeta } from 'primeng/api'
import { Component, OnInit, ViewChild } from '@angular/core'
import { Notifier, RestPagination, RestTable } from '@app/core'
import { Account, VideoOwnershipService } from '@app/shared/shared-main'
import { VideoChangeOwnership } from '@shared/models'
import { MyAccountAcceptOwnershipComponent } from './my-account-accept-ownership/my-account-accept-ownership.component'

@Component({
  selector: 'my-account-ownership',
  templateUrl: './my-account-ownership.component.html'
})
export class MyAccountOwnershipComponent extends RestTable implements OnInit {
  videoChangeOwnerships: VideoChangeOwnership[] = []
  totalRecords = 0
  sort: SortMeta = { field: 'createdAt', order: -1 }
  pagination: RestPagination = { count: this.rowsPerPage, start: 0 }

  @ViewChild('myAccountAcceptOwnershipComponent', { static: true }) myAccountAcceptOwnershipComponent: MyAccountAcceptOwnershipComponent

  constructor (
    private notifier: Notifier,
    private videoOwnershipService: VideoOwnershipService
  ) {
    super()
  }

  ngOnInit () {
    this.initialize()
  }

  getIdentifier () {
    return 'MyAccountOwnershipComponent'
  }

  createByString (account: Account) {
    return Account.CREATE_BY_STRING(account.name, account.host)
  }

  openAcceptModal (videoChangeOwnership: VideoChangeOwnership) {
    this.myAccountAcceptOwnershipComponent.show(videoChangeOwnership)
  }

  accepted () {
    this.loadData()
  }

  refuse (videoChangeOwnership: VideoChangeOwnership) {
    this.videoOwnershipService.refuseOwnership(videoChangeOwnership.id)
      .subscribe(
        () => this.loadData(),
        err => this.notifier.error(err.message)
      )
  }

  protected loadData () {
    return this.videoOwnershipService.getOwnershipChanges(this.pagination, this.sort)
      .subscribe(
        resultList => {
          this.videoChangeOwnerships = resultList.data
          this.totalRecords = resultList.total
        },

        err => this.notifier.error(err.message)
      )
  }
}
