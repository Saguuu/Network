# Generated by Django 3.2.13 on 2022-05-17 20:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20220516_2039'),
    ]

    operations = [
        migrations.AddField(
            model_name='siteuser',
            name='image',
            field=models.URLField(default='https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'),
        ),
    ]