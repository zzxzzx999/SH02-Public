# Generated by Django 5.1.3 on 2025-02-05 18:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gap', '0009_alter_company_dateregistered_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gapanalysis',
            name='companyEmail',
            field=models.EmailField(default='example@company.com', max_length=128),
        ),
    ]
