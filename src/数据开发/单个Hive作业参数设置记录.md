## 单个Hive作业参数设置记录

```python
# * 当日办理全屋WiFi用户
	hivesql = []
	hivesql.append('''set hive.auto.convert.join=true''' % vars())
	hivesql.append('''set mapred.reduce.tasks=200''' % vars())
	hivesql.append('''set hive.map.aggr=true''' % vars())                              # * 开启map端部分聚合功能
	hivesql.append('''set hive.groupby.skewindata=true'''% vars())                     # * 负载均衡
	hivesql.append('''insert overwrite table ap_pdt_fullhouse_wifi_d_t01
        select   a.offer_inst_id
                ,b.prod_inst_id     as pdt_id
                ,a.offer_id
                ,c.offer_name
                ,e.create_staff
                ,f.staff_code
                ,f.org_id
                ,g.org_name
                ,h.chnl_area_code    chnl_city_code
                ,h.chnl_area_desc    chnl_city_desc
                ,h.chnl_type_cd_2_code
                ,h.chnl_type_cd_2_name
                ,j.staff_name
                ,k.org_name
                ,d.accept_date
        from
                (
                select   t1.offer_inst_id
                        ,t1.offer_id
                from
                        ddwd.dd_pdt_offer_inst_d_%(v_thisyyyymm)s t1
                where
                        pt_d=%(v_thisyyyymmdd)s
                and
                        t1.offer_id in (61852,61853,61854,61856,61858,61859,61860,312001926,312001913,312001915,312001908)  --全屋WiFi销售品
                and
                        t1.status_cd = '1000'      --取生效的销售品
                and
                        time_format(t1.eff_date,'yyyymmdd')='%(v_thisyyyymmdd)s'  --当日
                ) a
        left join
                ddwd.dd_pdt_offer_prod_inst_rel_d_%(v_thisyyyymm)s  b
        on
                a.offer_inst_id = b.offer_inst_id
        and
                b.prod_use_type = '1000'
        and
                b.pt_d=%(v_thisyyyymmdd)s
        left join
                ddwd.dd_off_offer_d_%(v_thisyyyymm)s c
        on
                a.offer_id = c.offer_id
        and
                c.pt_d=%(v_thisyyyymmdd)s
        left join
                (select  a1.offer_inst_id
                        ,b1.order_item_id
                        ,b1.cust_order_id
                        ,b1.accept_date
                from
                        ddwd.dd_pdt_ord_offer_inst_d_%(v_thisyyyymm)s a1
                join
                        ddwd.dd_evt_order_item_d_%(v_thisyyyymm)s b1
                on
                        a1.order_item_id = b1.order_item_id
                and
                        b1.pt_d=%(v_thisyyyymmdd)s
                and
                        b1.service_offer_id = '3010100000' --订购销售品动作
                where
                        a1.pt_d=%(v_thisyyyymmdd)s
                ) d
        on
                a.offer_inst_id = d.offer_inst_id
        left join
                ddwd.dd_evt_customer_order_d_%(v_thisyyyymm)s e   --取相应全屋WiFi订单的创建渠道
        on
                d.cust_order_id = e.cust_order_id
        and
                e.pt_d=%(v_thisyyyymmdd)s
        left join
                ddwd.dd_par_staff_d_%(v_thisyyyymm)s f
        on
                e.create_staff=f.staff_id
        and
                f.pt_d='%(v_thisyyyymmdd)s'
        left join
                ddwd.dd_par_organization_d_%(v_thisyyyymm)s  g
        on
                f.org_id=g.org_id
        and
                g.pt_d='%(v_thisyyyymmdd)s'
        left join
                dmid.bwt_mkt_chn_info_d_%(v_thisyyyymm)s h
        on
                e.create_org_id=h.chnl_id
        and
                h.pt_d='%(v_thisyyyymmdd)s'
        left join
                 (select obj_id
                        ,dev_staff_id
                        ,dev_org_id
                        ,row_number() over(partition by obj_id order by create_date desc) num
                  from ddwd.dd_pdt_dev_staff_info_d_%(v_thisyyyymm)s
                  where status_cd <> '1100'
                  and obj_type = '120000'
                  and pt_d='%(v_thisyyyymmdd)s') i
        on
                b.prod_inst_id = i.obj_id
        and
                i.num = 1
        left join
                ddwd.dd_par_staff_d_%(v_thisyyyymm)s j
        on
                i.dev_staff_id=j.staff_id
        and
                j.pt_d='%(v_thisyyyymmdd)s'
        left join
                ddwd.dd_par_organization_d_%(v_thisyyyymm)s  k
        on
                i.dev_org_id=k.org_id
        and
                k.pt_d='%(v_thisyyyymmdd)s'
	''' % vars())
	v_stepnum = 4
	v_deal_type = 'I'
	v_deal_tab = v_table_name
	hiveExe.HiveExe(hivesql,v_database,v_thisyyyymmdd,v_serial_no,v_stepnum,v_deal_type,v_deal_tab,name)
```

