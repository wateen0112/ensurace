export interface DateTimeRange {
  start: string
  end: string
}

export interface GetAllAdvert {
  id: string
  name: string
  number: number
  branchName: string
  dateTimeRange: DateTimeRange
}
export class AddAdvert {
 name = ''
 description = ''
 imageFile = ''
 branchId = ''
 dateTimeRange: DateTimeRange = {
  start: '',
  end: '',
  }
}
export class GetDetailsAdvert {
  id = ''
  name = ''
  branchId = ''
  isToBranch = false
  description = ''
  imageUrl = ''
  imageFile = ''
  dateTimeRange: DateTimeRange = {
    end: '',
    start: '',
  }
}
