#include <linux/init.h>
#include <linux/module.h>
#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/slab.h>

MODULE_LICENSE("Dual BSD/GPL");

struct char_data {
};  
static struct cdev my_cdev;
static struct class *my_class;
static dev_t dev_num = -1;
uint8_t *kernel_buffer;

int char_open(struct inode *inode, struct file *filp)
{
   pr_info("char_dev: char_open");
   if((kernel_buffer = kmalloc(1024, GFP_KERNEL))==0)
   {
      pr_info("char_dev: char_open: kmalloc error");
      return -1;
   }
   return 0;
}


int char_release(struct inode *inode, struct file *filp)
{
   pr_info("char_dev: char_release");
   kfree(kernel_buffer);
   return 0;
}

ssize_t char_read(struct file *filp, char __user *buf, size_t count,
                loff_t *f_pos)
{
   pr_info("char_dev: char_read");
   if( copy_to_user(buf, kernel_buffer, 1024))
   {
      pr_info("char_dev: char_read: copy_to_user error");
      return -1;
   }
   return 0;
}

ssize_t char_write(struct file *filp, const char __user *buf, size_t count,
                loff_t *f_pos)
{
   pr_info("char_dev: char_write");
   if( copy_from_user(kernel_buffer, buf, 1024))
   {
      pr_info("char_dev: char_write: copy_from_user error");
      return -1;
   }
   return 0;
}  

struct file_operations my_fops = {
   .owner = THIS_MODULE,
   .open = char_open,
   .release = char_release,
   .read = char_read,
   .write = char_write, 
};
static int char_init(void)
{
   pr_info("char_dev: char_init");
   
   //register   
   if(alloc_chrdev_region(&dev_num,0,1,"char_region")<0)
   {
      pr_info("char_dev: alloc_chrdev_region error");
      return -1;
   }
   if((my_class = class_create(THIS_MODULE,"char_class"))==NULL)
   {
      pr_info("char_dev: class_create error");
      return -1;
   } 
   if(device_create(my_class, NULL, dev_num, NULL,"char_dev")==NULL)
   {
      pr_info("char_dev: device_create error");
      return -1;
   }
   cdev_init(&my_cdev,&my_fops);
   if (cdev_add(&my_cdev,dev_num,1) == -1)
   {
      pr_info("char_dev: cdev_add error");
      return -1;
   }   

   return 0;
}

static void char_exit(void)
{
   pr_info("char_dev: char_exit");

   device_destroy(my_class,dev_num);
   cdev_del(&my_cdev);
   class_destroy(my_class);
   unregister_chrdev_region(dev_num,1);
  
}

module_init(char_init);
module_exit(char_exit);


