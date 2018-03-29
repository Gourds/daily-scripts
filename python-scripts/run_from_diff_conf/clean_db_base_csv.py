
import merge_conf
import redis
import csv

db_auth = 'mUEiGo1Vy1bZeFhVsPN3VKnV'

def clean_old_db(del_obj,shard):
    del_ardb_host = del_obj[0].split(':')[0]
    del_ardb_port = del_obj[0].split(':')[1]
    del_ardb_num = del_obj[1]
    del_rank_host = del_obj[2].split(':')[0]
    del_rank_port = del_obj[2].split(':')[1]
    del_rank_num = del_obj[3]
    # print del_ardb_host,del_ardb_port,del_ardb_num,del_rank_host,del_rank_port,del_rank_num,db_auth
    Ardb_db = redis.StrictRedis(host=del_ardb_host, port=del_ardb_port, password=db_auth, db=del_ardb_num)
    print 'Waring: Shard:%s   Delete_dbHost: %s Port:%s  dbNum:%s' % (shard,del_ardb_host,del_ardb_port,del_ardb_num)
    #Ardb_db.flushdb()
    Rank_redis = redis.StrictRedis(host=del_rank_host, port=del_rank_port, password=db_auth, db=del_rank_num)
    print 'Waring: Shard:%s   Delete_dbHost: %s Port:%s  dbNum:%s' % (shard,del_rank_host,del_rank_port,del_rank_num)
    #Rank_redis.flushdb()

if __name__ == '__main__':
    try:
        with open('merge_plan.csv', 'rb') as f1:
            f1_csv = csv.reader(f1)
            title = next(f1_csv)
            for each_row in f1_csv:
                A_old_db = merge_conf.get_gm_data_info(each_row[0])
                B_old_db = merge_conf.get_gm_data_info(each_row[1])
                clean_old_db(A_old_db,each_row[0])
                clean_old_db(B_old_db,each_row[1])
    except IOError,e:
        print 'Check csv file'











