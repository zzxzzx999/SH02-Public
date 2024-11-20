import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gap_project.settings")

import django
django.setup()

from gap.models import GapAnalysis
import gap.jsonReadWrite as jsonReadWrite

def test():
    
    gap = GapAnalysis.objects.all()[0]
    print()
    print("Current answer: ", jsonReadWrite.getAnswer(1,1, gap))
    print("Now writing new answer (5) into json file")
    jsonReadWrite.writeAnswer(5,1,1, gap)
    print("New answer: ", jsonReadWrite.getAnswer(1,1,gap))

if __name__ == '__main__':
    print("Starting Json Test")
    test()
    