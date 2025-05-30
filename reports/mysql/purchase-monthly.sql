set
 @fromDate = '2020-04-01',
 @toDate = '2021-03-31';
with recursive tblDateList as
(
 select date(@fromDate) value
 union all
 select date_add(value, interval 1 day) from tblDateList where value < date(@toDate)
),
tblYearMonthList as
(
 select year(l.value) year, month(l.value) month
 from tblDateList l
 group by year(l.value), month(l.value)
),
tblDailySales as 
(
 select year(v.date) year, month(v.date) month,
 sum(a.amount) amount
 from trn_accounting a
 join trn_voucher v on v.guid = a.guid
 join mst_ledger l on l.name = a.ledger
 join mst_group g on g.name = l.parent
 where g.primary_group = 'Purchase Accounts' and v.date >= @fromDate and v.date <= @toDate
 group by year(v.date), month(v.date)
)
select l.year year, l.month month, ifnull(-s.amount, 0) amount
from tblYearMonthList l
left join tblDailySales s on (l.year = s.year and l.month = s.month)
order by l.year, l.month
;