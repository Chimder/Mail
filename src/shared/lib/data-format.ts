import moment from 'moment'

export const formatDate = (dateString: string): string => {
  const date = moment(dateString, 'ddd, D MMM YYYY HH:mm:ss ZZ')

  if (moment().isSame(date, 'day')) {
    // Если письмо пришло сегодня, показывать время
    return date.format('HH:mm')
  } else if (moment().isSame(date, 'week')) {
    // Если письмо пришло на этой неделе, показывать день недели
    return date.format('ddd')
  } else if (moment().isSame(date, 'year')) {
    // Если письмо попадает в текущий год, показывать месяц и дату
    return date.format('MMM D')
  } else {
    // Если письмо не попадает в текущий год, показывать месяц и год
    return date.format('MMM YYYY')
  }
}

export const formatTempDate = (dateString: string): string => {
  const date = moment(dateString)

  if (moment().isSame(date, 'day')) {
    // Если письмо пришло сегодня, показывать время
    return date.format('HH:mm')
  } else if (moment().isSame(date, 'day')) {
    // Если письмо было получено вчера, показывать день недели и время
    return date.format('ddd HH:mm')
  } else {
    // В других случаях отобразить полную дату и время
    return date.format('MMM D, YYYY HH:mm')
  }
}
